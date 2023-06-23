TypeScript support comes with few more caveats than described in {@link Introduction}.

# Export types with your error classes

In the {@link Introduction} I proposed to create all of your errors in a single file and import them from there. There
is one little detail that you should be aware of.

If you want to use your errors in callbacks and constraint argument type to be one of your errors, you need to specify
it like that:

```typescript
const BaseError = createError("BaseError");
const handleError = (e: ReturnType<typeof BaseError>) => {}
```

Not very beautiful, but that's a limitation of TypeScript I can't overcome. However, if you export types with the same
name as your errors, you can use them directly:

```typescript
// file: errors.ts
export const BaseError = createError("BaseError");
export type BaseError = ReturnType<typeof BaseError>;

// file: app.ts
import { BaseError } from "./errors";

const handleError = (e: BaseError) => {}; // works

const myError = new BaseError(); // also works

handleError(myError); // and this works too
```

## Errors with the same shape of details object are considered the same

TypeScript uses duck typing, which means that if two objects have the same shape, they are considered the same type.
Name of the error due some TypeScript limitations doesn't distinguish between two types for now.

So if you have created two types with the same (or missing) `details` object shape, TypeScript will consider them the
same:
```typescript
// file: errors.ts
export const FatalError = createError<{ date: number }>("FatalError");
export type FatalError = ReturnType<typeof FatalError>;

export const NonFatalError = createError<{ date: number }>("NonFatalError");
export type NonFatalError = ReturnType<typeof NonFatalError>;

// file: app.ts
import { FatalError, NonFatalError } from "./errors";

const handleError = (e: FatalError) => {
    e instanceof FatalError; // could be false!
};

handleError(new NonFatalError()); // no TS error here!
```
