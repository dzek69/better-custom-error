# @ezez/errors

JavaScript's errors with superpowers! ⚡

## Features:

- 🛠 First class TypeScript support - 100% type safe and intellisense friendly
- 📝 Attach extra data to an error - debug with ease
- 🪬 Give your errors a meaningful name - improve code readability
- 🧱 Build your errors one on top of another - access the whole hierarchy
- 📦 No dependencies - use it anywhere
- 🌟 Bonus features - clean up your stack traces, normalize invalid values

## Usage

> Full documentation available here: [documentation](https://ezez.dev/docs/errors/latest/).

`npm i @ezez/errors --save`

```javascript
import { createError } from "@ezez/errors";
// or const { createError } = require("@ezez/errors");

const DatabaseError = createError("DatabaseError");
const QueryError = createError("QueryError", DatabaseError); // it extends `Error` by default, but you can pass another error
const InsertQueryError = createError("InsertQueryError", QueryError, { cleanStackTraces: false });

// then

throw new DatabaseError("Database error", { date: Date.now(), { ... } });
```

## License

MIT
