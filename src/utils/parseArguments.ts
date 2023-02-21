import type { Arg, CustomError, Data } from "../types";

const MAX_ARGUMENTS = 3;

const invalidArguments = () => {
    throw new TypeError("Invalid arguments passed into error");
};

const parseArguments = (...args: Arg<Data>[]) => { // eslint-disable-line max-statements
    let sourceError: Error | CustomError<Data> | undefined, message: string | undefined, details: Data | undefined;

    if (args.length > MAX_ARGUMENTS) {
        invalidArguments();
    }

    const useArgs = args.filter(a => a != null); // get rid of nulls and undefined

    const errors = useArgs.filter(a => a instanceof Error) as (Error | CustomError<Data>)[];
    const errorsLength = errors.length;
    if (errorsLength > 1) {
        invalidArguments();
    }

    const strings = useArgs.filter(a => typeof a === "string") as string[];
    const stringsLength = strings.length;
    if (stringsLength > 1) {
        invalidArguments();
    }

    const objects = useArgs.filter(a => typeof a === "object" && !(a instanceof Error)) as Data[];
    const objectsLength = objects.length;
    if (objectsLength > 1) {
        invalidArguments();
    }

    if (errorsLength) {
        sourceError = errors[0]; // accessing non-existing property is slower than this if
    }
    if (stringsLength) {
        message = strings[0];
    }
    if (objectsLength) {
        details = objects[0];
    }

    return {
        sourceError, message, details,
    };
};

export {
    parseArguments,
};
