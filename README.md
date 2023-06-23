# @ezez/errors

JavaScript's errors with superpowers! ⚡

## Features:

- 🛠 First class TypeScript support - 100% type safe and intellisense friendly
- 📝 Attach extra data to an error - debug with ease
- 🪬 Give your errors a meaningful name - improve code readability
- 🧱 Build your errors on top of another - access the whole hierarchy
- 🌟 Bonus features - clean up your stack traces, normalize non-errors
- 📦 No dependencies - use it anywhere
- 🌎 Universal - exposes both ESM modules and CommonJS

## Usage

> Full documentation, including TypeScript usage available here: [documentation](https://ezez.dev/docs/errors/latest/).

`npm i @ezez/errors --save`

```javascript
import { createError } from "@ezez/errors";
// or const { createError } = require("@ezez/errors");

const DatabaseError = createError("DatabaseError");
const QueryError = createError("QueryError", DatabaseError); // it extends `Error` by default, but you can pass another error
const InsertQueryError = createError("InsertQueryError", QueryError, { cleanStackTraces: false });

// then

try {
    throw new DatabaseError("Connection lost", { date: Date.now(), { ... } });
}
catch (e) {
    if (e instanceof DatabaseError) {
        console.error(e.details?.date, e.message);
    }
}
```

## License

MIT
