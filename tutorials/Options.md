`@ezez/errors` can help you solve some of your ugly stack trace problems. You may find some stack traces lines unuseful.

You can hide lines like that on all instances of given error by setting a 3rd argument to `createError`:
```
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
```

To do that you need to pass `cleanStackTraces` option to `createError`:
```javascript
createError("SomeError", Error, {
    cleanStackTraces: true,
});
```

You can also override defaults for all created errors by calling exported `setDefaultOptions`.

```javascript
setDefaultOptions({
    cleanStackTraces: false,
});
```

> Note: Overriding defaults does NOT change behavior of already created instances.
