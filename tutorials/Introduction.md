This library is a battle-tested attempt to make creating custom errors easier. How many times you wanted to return
i.e.: http status code with an error?

Something like that surely works:
```javascript
const error = new Error("Cannot do stuff");
error.statusCode = 400;
throw error;
```

But it's not very readable, you can't easily distinguish it from a regular error, and it's not type safe.

What if you could do something like that?
```javascript
throw new APIError("Cannot do stuff", { statusCode: 400 });
```

`@ezez/errors` allows you to do just that!

# Full-featured usage

I propose to create a file with all your custom errors. You can later import them from there.

## Creating and extending instances

To create a new error class use exported `createError` function.
The only argument is the error name, accessible later on `name` class property and all instances.

```typescript
// file: errors.ts
import { createError } from "@ezez/errors";

export const DatabaseError = createError("DatabaseError");

export const QueryError = DatabaseError.extend("QueryError"); // extend custom error
export const ApiParametersError = createError("ApiParametersError", TypeError); // extend built-in error
```

We just created:
- a database error class
- a query error class, i.e. for any error related to querying the database
- an api parameters error class, i.e. for any error related to api parameters

We used two available syntaxes for creating new error classes:
- `createError(name, TypeError)` - use this one if you want to extend any native error (like `TypeError`, `SyntaxError`
etc.)
- `SomeError.extend(name)` - use this one if you want to extend your custom error

> Note: Without TypeScript createError can be used for extending custom errors too, but it's recommended to still use
> these methods as described above.

## Throwing errors

Throw your errors like you would throw any other error:
```typescript
throw new DatabaseError("Connection lost");
```

Or feel the power of `@ezez/errors` and throw errors with extra data:
```typescript
throw new DatabaseError("Connection lost", { date: Date.now(), uptime: process.uptime() });
throw new QueryError("Query failed", { query: "SELECT * FROM users", date: Date.now(), queryTime: 1234 });
```

## Catching errors

First, a humble reminder - in JavaScript anything can be thrown. It can be built-in errors like `TypeError` or just
`Error`, custom errors like these created with `@ezez/errors` or even plain objects or primitives.

While it's an evil practice to `throw 100` - it's still possible, so always typecheck your errors before using them.

```typescript
try {
    throw QueryError("Query failed", { query: "SELECT * FROM users" });
}
catch (e) {
    if (e instanceof QueryError) {
        console.error(e.message, e.details?.query);
    }
    else if (e instanceof Error) {
        console.error(e.message);
    }
    else {
        console.error("Not an error type", e);
    }
}
```

**Important reminder:**

`instanceof` will check if given value is an instance of given type or any of its ancestors. This means if you do
multi-level extends with your classes - always check for the most specific type first, then for the less specific
(this is also why we used `else` in this example). You can always check the `name` property of the error as well.

```typescript
try {
    throw DatabaseError("Connection failed");
}
catch (e) {
    if (e instanceof QueryError) {
        // this is true, because QueryError is a subclass of DatabaseError
        console.error(e.name); // "DatabaseError"
    }
    if (e instanceof Error) {
        // this is also true, we are missing `else` so this part of code will execute as well
        console.error(e.message);
    }
}
```

# Type safety

> If you don't use TypeScript, you can skip this section.

When creating an error class with `createError` function, you can pass a generic type that defines the type of extra
data you may want to throw with your error. Omitting it will allow any data to be passed.

```typescript
const QueryError = createError<{ query: string }>("QueryError");

try {
    throw new QueryError("Query failed", { query: "SELECT * FROM users" });
}
catch (e) {
    if (e instanceof QueryError) {
        console.error(e.message, e.details?.query);
    }
}
```

`e.details?.` has intellisense support, so you can easily see what data is available and work with it.

Why optional chaining then? `details` property is always optional, even if you specify the shape of extra data - you
**don't have** to pass anything, but you **can** pass data that matches the shape.

> Note: When extending a class that defines a shape of extra data, your subclass will inherit that shape. If you want
> you can provide a **subtype** of the shape, ie: add additional properties to it.
>
> This is to provide extra type safety. See `Important reminder` of `Catching errors` section.

# Bonus features

## Normalizing errors

Instead of doing typechecks if something caught is not an error you can normalize any value to be an error. Every error
class created with `createError` has a static method `normalize` you can use to achieve that.

```typescript
const BaseError = createError("BaseError");

try {
    throw 5;
}
catch (e) {
    const error = BaseError.normalize(e);
    // you can now be sure that `error` is an instance of `BaseError` or any of native errors.
    console.error(error.message);
}
```

Normalizing can be done with three modes:
- `instanceof` - it will NOT normalize if given value is instance of `Error`
- `strict` - it will NOT normalize if given value looks very close to an `Error` instance, but it doesn't do
`instanceof` check - instead it checks if given value has `name`, `message`, `stack` properties, that are
non-enumerable strings, and `name` is ending with `Error`. This is the default mode. It should support most node errors
that doesn't follow the "thrown values have to be `instanceof` Error" practice.
- `loose` - it will NOT normalize anything that has `name`, `message` and `stack` properties. Use it if you work with a
lot of bad error lookalikes, but for some reason you want to keep them.

## Building an error from another error

Sometimes you want to throw an error that is based on another error. For example, you want to throw a `RenderError`
but you want to keep the original error message and stack trace. You can do that!

```typescript
const RenderError = createError("RenderError");

const renderHTML = () => {
    try {
        return render();
    }
    catch (originalError) {
        // Make sure to ensure that `originalError` is an instance of `Error`!
        // See `Normalizing errors` section for more info.
        throw new RenderError("Failed to render HTML", { date: Date.now() }, originalError);
    }
}

try {
    renderHTML()
}
catch (e) {
    if (e instanceof RenderError) {
        console.error(e.message, e.details?.date); // RenderError: Failed to render HTML, 123456789
        console.error(e.parent?.message); // i.e.: Error: cannot read property `foo` of undefined
        console.error(e.ancestors); // array of [parent, parent of that parent, ...until there is no parent]
    }
}
```

## Throwing an error freedom

When creating instance of your error it expects three values:
- `{string}` - a message
- `{object}` - error details
- `{Error}` - parent error

What's important - you can even skip some of them and provide null/undefined instead.

> Note: If you pass some argument type twice (like two strings) - you will instead get a `TypeError` thrown.

> Note: If you skip error message, but provide parent error - the message will be copied from the parent error.

# Advanced usage demo and the `names` property

`names` property is an array of strings that describe the hierarchy of errors. It can be useful to understand what
happened if you log your errors and review them later.

Let's take a look at the example:
```javascript
[
    "DatabaseError",
    ["TypeError", "Error"],
    "InternalServerError",
    "Error",
]
```

This means that `DatabaseError` was instantiated with `TypeError` error as argument. `TypeError` inherits from `Error`.
And `DatabaseError` inherits from `InternalServerError` which inherits from `Error`.

This array is safe to be stringified for logging purposes, it will look like this when stringified:
`"(DatabaseError,(TypeError,Error),InternalServerError,Error)"`

Now let's take a look at more complex example:

```javascript
const NotFoundError = createError("NotFoundError");
const InternalServerError = createError("InternalServerError");

const DatabaseError = InternalServerError.extend("DatabaseError")
const RenderError = InternalServerError.extend("RenderError");
const UnknownError = InternalServerError.extend("UnknownError");

// A database operations handler example
const db = { query: (query) => {
   // Some implementation, let's assume it throws an error
   throw new DatabaseError("Database query failed", { query });
}};

// Function that gets a product from database
const getProduct = id => {
    if (!id) {
        throw new TypeError("Product id is missing");
    }
    const data = db.query("SELECT * FROM products WHERE id = ?", id);
    if (!data) {
        throw new NotFoundError("Product cannot be found", { id });
    }
    return data;
};

// Function that renders a product page using given data
const renderProduct = (product) => {
    // Some implementation, let's assume it throws an error
    throw new RenderError("Failed to render product page");
};

// Function that fetches all data needed and renders a product page
const renderProductPage = (id) => {
    try {
        const product = getProduct(id);
        return renderProduct(product);
    }
    catch (error) {
        if (error instanceof TypeError) {
            // Change error type, adding more details and keeping parent error message and stack trace
            throw new InternalServerError("Failed to get product", { id }, error);
        }

        throw error; // rethrow error otherwise
    }
}

// Main app operation
try {
    const html = renderProductPage(req.GET.id);
    res.send(html);
}
catch (e) {
    // Making sure we always work with errors
    // If we caught something that is not an error, we will create an instance of UnknownError
    // Otherwise it will be still the same value as `e`
    const normalizedError = UnknownError.normalize(e);

    // Let's log the error to some service
    loggingService.log(
        normalizedError.name, normalizedError.message, normalizedError.details, String(e.names), normalizedError.stack
    );

    // Use error instance type to determine return code
    if (e instanceof NotFoundError) {
        res.send(router.renderError(404));
    }
    else {
        res.send(router.renderError(500));
    }
}
```
