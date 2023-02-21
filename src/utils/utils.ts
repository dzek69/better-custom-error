import type { CustomError, Data, Names } from "../types";

interface Prototype {
    name: string;
}

const getMessage = (error?: Error | CustomError<Data>, message?: string): string => {
    return message || (error?.message) || "";
};

const getDetails = (error?: Error | CustomError<Data>, details?: Data) => {
    // @ts-expect-error Yes TS, I know
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return details || (error?.details as Data) || null;
};

// @TODO better typings here?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPrototypesNames = (obj: any): string[] => {
    const MAX_DEPTH = 100;
    const result = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let i, currentPrototype: any;

    i = 0;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    currentPrototype = obj;

    while (currentPrototype && i++ < MAX_DEPTH) {
        const proto = Object.getPrototypeOf(currentPrototype) as Prototype | undefined;
        if (proto?.name) {
            const repeatedPrototypeName = result[result.length - 1] === proto.name;
            if (!repeatedPrototypeName) { // hide side effect of this library
                result.push(proto.name);
            }
        }
        currentPrototype = proto;
    }
    return result;
};

const enhanceToString = (array: Names) => {
    Object.defineProperty(array, "toString", {
        configurable: true,
        enumerable: false,
        value: function toStringCustom() {
            return "(" + Array.prototype.toString.call(this) + ")";
        },
        writable: true,
    });
    return array;
};

export {
    getMessage,
    getDetails,
    getPrototypesNames,
    enhanceToString,
};
