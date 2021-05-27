import {
    parseArguments,
    enhanceToString,
    getDetails,
    getMessage,
    getPrototypesNames,
    cleanUpStack,
} from "./utils/index.js";
import type { Arg, Options, CustomErrorConstructor } from "./types";

const defaultOptions: Options = {
    cleanStackTraces: true,
};

let globalDefaultOptions: Options = {};

/**
 * Sets default options for all future created errors. Does not affect previously created errors!
 * @param {Options} options
 */
const setDefaultOptions = (options: Options) => {
    globalDefaultOptions = options;
};

/**
 * Creates new custom Error constructor.
 *
 * @param {string} name - error name
 * @param {Error} [ParentError] - Error to inherit from (built-in or custom error)
 * @param {Options} [options] - options to override global options
 * @returns {CustomError}
 */
const createError = (name: string, ParentError = Error, options?: Options) => { // eslint-disable-line max-lines-per-function, max-len
    const useOptions = Object.assign( // eslint-disable-line prefer-object-spread
        {},
        defaultOptions,
        globalDefaultOptions,
        options,
    );

    /**
     * Creates custom error object instance. Arguments order doesn't matter.
     *
     * @param {*} this - ignore, do not pass, TS & docs engine incompatibility
     * @param {Error|Object|string|void|null} arg1 - parent error instance or error message or error details object
     * @param {Error|Object|string|void|null} arg2 - parent error instance or error message or error details object
     * @param {Error|Object|string|void|null} arg3 - parent error instance or error message or error details object
     * @returns {CustomError}
     * @constructor
     */
    const CustomError = function CustomError(this: typeof CustomError, arg1: Arg, arg2: Arg, arg3: Arg) {
        if (!(this instanceof CustomError)) {
            // @ts-expect-error needed if creating instances without `class`
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return new CustomError(arg1, arg2, arg3);
        }

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
        });
    } as CustomErrorConstructor;

    CustomError.prototype = new ParentError();
    return CustomError;
};

export {
    createError,
    setDefaultOptions,
};
