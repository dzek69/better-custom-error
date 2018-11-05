# better-custom-error

Custom inherits-from-Error constructor creator. Simplifies usage, works with Babel (as opposed to native ES6 `class`),
allows to pass custom data to errors, useful for logging.

## TODO

- Further memory optimization:
    - create and extend one Custom Error instance
    - use getters to delay some calculations from error creation to actual read place
- Ability to override Error prototype so some `better-custom-error` features will be available on native errors too

## License

MIT
