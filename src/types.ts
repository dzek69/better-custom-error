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
interface CustomError<D = { [key: string]: unknown }> extends Error {
    names: Names;
    details?: D;
}

type Arg<D> = Error | CustomError | string | D | undefined | null;

interface CustomErrorConstructor<D> extends CustomError {
    new(arg1?: Arg<D>, arg2?: Arg<D>, arg3?: Arg<D>): CustomError<D>;
    (arg1?: Arg<D>, arg2?: Arg<D>, arg3?: Arg<D>): CustomError<D>;
    stackTraceLimit: ErrorConstructor["stackTraceLimit"];
    captureStackTrace: ErrorConstructor["captureStackTrace"];
}

/**
 * @property cleanStackTraces - should stack trace be cleaned up from node internals
 */
interface Options {
    cleanStackTraces?: boolean;
}

export type { Options, Names, Data, Arg, CustomError, CustomErrorConstructor };
