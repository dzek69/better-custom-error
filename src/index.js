const getPrototypesNames = obj => {
    const MAX_DEPTH = 100;
    const result = [];

    let i, currentPrototype;

    i = 0;
    currentPrototype = obj;

    while (currentPrototype && i++ < MAX_DEPTH) {
        const proto = Object.getPrototypeOf(currentPrototype);
        if (proto && proto.name) {
            const repeatedPrototypeName = result[result.length - 1] === proto.name;
            if (!repeatedPrototypeName) { // hide side effect of this library
                result.push(proto.name);
            }
        }
        currentPrototype = proto;
    }
    return result;
};

const getMessage = (error, message) => {
    return message || (error && error.message) || "";
};

const getDetails = (error, details) => {
    return details || (error && error.details) || null;
};

const MAX_ARGUMENTS = 3;

const parseArguments = (...args) => { // eslint-disable-line max-statements
    let sourceError, message, details;
    const invalidArguments = () => {
        throw new TypeError("Invalid arguments passed into error");
    };

    if (args.length > MAX_ARGUMENTS) {
        invalidArguments();
    }

    const useArgs = args.filter(a => a != null); // get rid of nulls and undefined

    const errors = useArgs.filter(a => a instanceof Error);
    const errorsLength = errors.length;
    if (errorsLength > 1) {
        invalidArguments();
    }

    const strings = useArgs.filter(a => typeof a === "string");
    const stringsLength = strings.length;
    if (stringsLength > 1) {
        invalidArguments();
    }

    const objects = useArgs.filter(a => typeof a === "object" && !(a instanceof Error));
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

const enhanceToString = array => {
    array.toString = function toStringCustom() { // eslint-disable-line no-param-reassign
        return "(" + Array.prototype.toString.call(this) + ")";
    };
    return array;
};

const createError = (name, ParentError = Error) => {
    const CustomError = function CustomError(arg1, arg2, arg3) {
        if (!(this instanceof CustomError)) {
            return new CustomError(arg1, arg2, arg3);
        }

        const { sourceError, message, details } = parseArguments(arg1, arg2, arg3);

        this.name = name;

        // provide list of parent errors
        this.names = enhanceToString([name]);
        if (sourceError) {
            if (sourceError.names) {
                this.names.push(sourceError.names);
            }
            else {
                this.names.push(enhanceToString(getPrototypesNames(sourceError)));
            }
        }
        this.names.push(...getPrototypesNames(this));

        this.message = getMessage(sourceError, message);
        this.details = getDetails(sourceError, details);
    };
    CustomError.prototype = new ParentError();
    return CustomError;
};

export default createError;
