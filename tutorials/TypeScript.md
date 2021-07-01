## All errors are the same for TS

This library is basically all about creating new types on runtime.
TypeScript is static typechecker, therefore it doesn't play perfect with this, because every error has basically the
same type, optionally differentiating on `details` object shape.

Therefore you can't expect something like that to work:

```typescript
const MyErr = createError("MyErr");
const OtherErr = createError("OtherErr");

const handleError = (e: ReturnType<typeof OtherError>) => {}

handleError(new MyErr()); // no TS error here! Both types are the same for TS (until you type them manually)
```

## However...

You can now specify `details` object shape via:
```typescript
const ToyError = createError<{ toy: ToyItem }>("ToyError");
const FoodError = createError<{ food: FoodItem }>("FoodError");

const handleError = (e: ReturnType<typeof ToyError>) => {}

const myFoodError = new FoodError();

handleError(myFoodError); // TS error!
```

While defining `details` shape is useful by itself it also can work as a type guard.

## Why ReturnType is needed?

`Error` and `ErrorConstructor` are two different things. TypeScript however has both available as globals and is able to
determinate which one do you mean basing on usage.

With custom errors it's not the case.
In previous Example `FoodError` is an `ErrorConstructor` (`CustomErrorConstructor` to be precise).
`myFoodError` is `Error` (or `CustomError`).

Constructor returns the instance.

I will try to improve it with future versions if I will find a way.
