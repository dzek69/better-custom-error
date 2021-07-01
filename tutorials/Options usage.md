See {@link Options} first.

You can override defaults just for single Error constructor when creating it:
```javascript
createError(name, ParentError, options);
```

You can also override defaults for all created errors by calling `setDefaultOptions`.

```javascript
setDefaultOptions({
    cleanStackTraces: false,
});
```

> Note: Overriding defaults does NOT change behavior of already created instances.
