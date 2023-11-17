import type { OmitIndexSignature } from "type-fest";
import type {
    Options,
    CustomErrorConstructor,
    CustomError as CustomErrorType,
    Data,
    Nullable,
    CustomError, NormalizeOptions,
} from "./types";

import {
    parseArguments,
    enhanceToString,
    getDetails,
    getMessage,
    getPrototypesNames,
    cleanUpStack,
} from "./utils/index.js";

const defaultOptions: Options = {
    cleanStackTraces: false,
};

let globalDefaultOptions: Options = {};

/**
 * Sets default options for all future created errors. Does not affect previously created errors!
 * @param options
 */
const setDefaultOptions = (options: Options) => {
    globalDefaultOptions = options;
};

/**
 * Creates new custom Error constructor. Use it to create errors to throw.
 *
 * @param name - error name
 * @param ParentError - Error to inherit from (built-in or custom error)
 * @param options - options to override global options
 *
 * @typeparam D - details object interface
 *
 * @example
 * Create basic custom error
 * ```
 * const MyError = createError("MyError");
 * throw new MyError("My custom problem happened");
 * ```
 *
 * @example
 * Create custom error with specified details shape
 * ```
 * const HttpError = createError<{ code: number, url: string }>("HttpError");
 * throw new HttpError("Not Found", { code: 404, url: "/image.gif" });
 * ```
 *
 * @example
 * Create custom error defining parent error to inherit from
 * ```
 * const HttpError = createError<{ code: number, url: string }>("HttpError");
 * const NotFoundError = createError({ url: string }, HttpError);
 *
 * const err = new NotFoundError("Not Found", { url: "/image.gif" });
 * err instanceof NotFoundError; // true
 * err instanceof HttpError; // true
 * ```
 * @returns {CustomError}
 */
const createError = <D extends OmitIndexSignature<Data>>(name: string, ParentError: ErrorConstructor & { extend?: never } = Error, options?: Options) => { // eslint-disable-line max-lines-per-function, max-len
    const useOptions = Object.assign( // eslint-disable-line prefer-object-spread
        {},
        defaultOptions,
        globalDefaultOptions,
        options,
    );

    /**
     * Creates custom error object instance. Arguments order doesn't matter.
     *
     * @param {Error|Object|string|void|null} arg1 - parent error instance or error message or error details object
     * @param {Error|Object|string|void|null} arg2 - parent error instance or error message or error details object
     * @param {Error|Object|string|void|null} arg3 - parent error instance or error message or error details object
     * @returns {CustomError}
     * @constructor
     */
    const CustomError = function CustomError(this: typeof CustomError, arg1?: Nullable<string>, arg2?: Nullable<D>, arg3?: Nullable<Error>) { // eslint-disable-line max-lines-per-function, max-len, @typescript-eslint/no-shadow
        if (!(this instanceof CustomError)) {
            // @ts-expect-error needed if creating instances without `class`
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return new CustomError(arg1, arg2, arg3);
        }

        // This is currently not useful without any order arguments, but let's keep it for future overloads
        const { sourceError, message, details } = parseArguments(arg1, arg2, arg3);

        const names = enhanceToString([name]);
        if (sourceError) {
            if ("names" in sourceError) {
                names.push(sourceError.names);
            }
            else {
                names.push(enhanceToString(getPrototypesNames(sourceError)));
            }
        }
        names.push(...getPrototypesNames(this));

        const useMessage = getMessage(sourceError, message);

        Object.defineProperties(this, {
            name: {
                configurable: true,
                enumerable: false,
                value: name,
                writable: true,
            },
            names: {
                configurable: true,
                enumerable: false,
                value: names,
                writable: true,
            },
            message: {
                configurable: true,
                enumerable: false,
                value: useMessage,
                writable: true,
            },
            details: {
                configurable: true,
                enumerable: false,
                value: getDetails(sourceError, details),
                writable: true,
            },
            stack: {
                configurable: true,
                enumerable: false,
                value: cleanUpStack(new Error().stack!, name, useMessage, useOptions),
                writable: true,
            },
            ancestors: {
                configurable: true,
                get: (): Error[] => {
                    const ancestors: Error[] = [];
                    // @ts-expect-error TS can't understand things again
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    let currentError: CustomError<D> | Error | undefined = this.parent;
                    while (currentError) {
                        ancestors.push(currentError);
                        currentError = (currentError as CustomError<D>).parent;
                    }
                    return ancestors;
                },
            },
        });
        if (sourceError) {
            Object.defineProperty(this, "parent", {
                configurable: true,
                enumerable: false,
                value: sourceError,
                writable: true,
            });
        }
    } as CustomErrorConstructor<D>;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    CustomError.extend = <D extends Data>(name: string, options: Options = {}) => createError<D>(
        name, CustomError as ErrorConstructor, options,
    );
    // eslint-disable-next-line @typescript-eslint/no-shadow
    CustomError.normalize = (maybeError: unknown, options: NormalizeOptions = { mode: "strict" }) => {
        const normalized = new CustomError("Not an error: " + String(maybeError));
        if (!maybeError || typeof maybeError !== "object") {
            return normalized;
        }
        if (options.mode === "instanceof") {
            if (maybeError instanceof Error) {
                return maybeError;
            }
            return normalized;
        }

        const hasProperties = "name" in maybeError && "stack" in maybeError && "message" in maybeError;

        if (options.mode === "strict") {
            if (
                hasProperties
                && typeof maybeError.name === "string" && typeof maybeError.stack === "string"
                && typeof maybeError.message === "string" && maybeError.name.endsWith("Error")
            ) {
                return maybeError as Error;
            }
            return normalized;
        }

        if (hasProperties) {
            return maybeError as Error;
        }

        return normalized;
    };

    // @ts-expect-error - it has to be like that
    CustomError.prototype = new ParentError();
    Object.defineProperty(CustomError, "name", {
        configurable: true,
        enumerable: false,
        value: name,
        writable: true,
    });
    return CustomError;
};

export {
    createError,
    setDefaultOptions,
};

export type {
    CustomErrorType as CustomError,
    CustomErrorConstructor,
    Options,
};
