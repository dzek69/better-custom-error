/**
 * Deep array of error names hierarchy
 */
type Names = (string | Names)[];

/**
 * Extra data that can be attached to the error
 */
type Data = Record<string, unknown>;

type Nullable<T> = T | null | undefined;

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
    parent?: CustomError<Data> | Error;
    ancestors: (CustomError<Data> | Error)[];
    names: Names;
}

type Arg<D extends Data> = Error | CustomError<D> | string | D | undefined | null;

interface CustomErrorConstructor2<D extends Data> {
    new(arg1?: Nullable<string>, arg2?: Nullable<D>, arg3?: Nullable<Error>): CustomError<D>;
    (arg1?: Nullable<string>, arg2?: Nullable<D>, arg3?: Nullable<Error>): CustomError<D>;
    stackTraceLimit: ErrorConstructor["stackTraceLimit"];
    captureStackTrace: ErrorConstructor["captureStackTrace"];
    extend: <D2 extends D>(name: string, options?: Options) => CustomErrorConstructor<D2>;
    normalize: (maybeError: unknown) => CustomError<D> | Error;
    prototype: CustomError<D>;
}

type CustomErrorConstructor<D extends Data> = CustomErrorConstructor2<D>;

/**
 * @property cleanStackTraces - should stack trace be cleaned up from node internals
 */
interface Options {
    cleanStackTraces?: boolean;
}

export type { Options, Names, Nullable, Data, Arg, CustomError, CustomErrorConstructor };
