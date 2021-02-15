import type { Options } from "../types";

/**
 * @param {string} stack
 * @param {string} name
 * @param {string} message
 * @param {Options} options
 * @private
 * @returns {string} new stack trace
 */
const cleanUpStack = (stack: string, name: string, message: string, { cleanStackTraces }: Options) => {
    let newLines;

    const lines = stack.split("\n");
    const newFirstLine = name + (message ? ": " + message : "");

    lines.shift(); // remove name/message line
    lines.shift(); // remove first line of stack as it contains internal call we don't need
    if (cleanStackTraces) {
        newLines = lines.filter((line) => {
            return (
                !(/at .* \(internal.*:\d+:\d+\)/.test(line))
                && !(/at .* \(node:internal.*:\d+:\d+\)/.test(line))
            );
        });
    }
    else {
        newLines = lines;
    }

    return newFirstLine + "\n" + newLines.join("\n");
};

export {
    cleanUpStack,
};
