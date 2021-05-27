type Names = (string | Names)[];

interface Data {}

/**
 * @typedef {Error} CustomError
 * @property {string} name - error name
 * @property {string} message - error message
 * @property {string} stack - error stack trace
 * @property {Object} details - error details
 * @property {Array.<Array|string>} names - hierarchy of extended/parent error names
 */
interface CustomError extends Error {
    names: Names;
    details?: Record<string, unknown>;
}

type Arg = Error | CustomError | string | Data | undefined | null;

interface CustomErrorConstructor extends CustomError {
    new(arg1?: Arg, arg2?: Arg, arg3?: Arg): CustomError;
    (arg1?: Arg, arg2?: Arg, arg3?: Arg): CustomError;
}

/**
 * @typedef {Object} Options
 * @property {boolean} cleanStackTraces - should stack trace be cleaned up from node internals
 */
interface Options {
    cleanStackTraces?: boolean;
}

export type { Names, Data, Arg, CustomError, CustomErrorConstructor, Options };
