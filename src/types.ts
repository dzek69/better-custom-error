/**
 * Deep array of error names hierarchy
 */
type Names = (string | Names)[];

/**
 * Extra data that can be attached to the error
 */
type Data = Record<string, unknown>;

/**
 * @typedef {Error} CustomError
 * @property {string} name - error name
 * @property {string} message - error message
 * @property {string} stack - error stack trace
 * @property {Object} details - error details
 * @property {Array.<Array|string>} names - hierarchy of extended/parent error names
 */
interface CustomError<D extends Data> extends Error {
    details?: D;
    parent: CustomError<Data> | Error;
    names: Names;
}

type Arg<D extends Data> = Error | CustomError<D> | string | D | undefined | null;

interface CustomErrorConstructor2<D extends Data> {
    new(arg1?: Arg<D>, arg2?: Arg<D>, arg3?: Arg<D>): CustomError<D>;
    (arg1?: Arg<D>, arg2?: Arg<D>, arg3?: Arg<D>): CustomError<D>;
    stackTraceLimit: ErrorConstructor["stackTraceLimit"];
    captureStackTrace: ErrorConstructor["captureStackTrace"];
    extend: (name: string, options?: Options) => CustomErrorConstructor<D>;
    normalize: (maybeError: unknown) => CustomError<D>;
    prototype: CustomError<D>;
}

type CustomErrorConstructor<D extends Data> = CustomErrorConstructor2<D>;

/**
 * @property cleanStackTraces - should stack trace be cleaned up from node internals
 */
interface Options {
    cleanStackTraces?: boolean;
}

export type { Options, Names, Data, Arg, CustomError, CustomErrorConstructor };
