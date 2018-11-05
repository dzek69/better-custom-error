const createError = require("../../dist").default;

if (!{}.must) {
    console.error("Must.js is not registered. Do not run this file directly. Use index.js");
    process.exit(1); // eslint-disable-line no-process-exit
}

console.info("");
console.info("createError (stack trace)");
console.info("");

const ok = (string) => {
    console.info("    ✔ " + string);
};
const error = (string, e) => {
    console.info("    ❌ " + string);
    if (e && e.name === "AssertionError") {
        console.info("");
        console.info("Assertion error: " + e.message);
        console.info("");
        console.info("Expected:" + e.expected);
        console.info("Actual  :" + e.actual);
        console.info("");
        const stackLines = e.stack.split("\n");
        stackLines.shift();
        console.info(stackLines.join("\n"));
    }
    else {
        console.info(e);
    }
};

let test;

try {
    test = "has expected stack trace first line";
    const MyError = createError("MyError", SyntaxError, { cleanStackTraces: false });

    const err = new MyError("Bad things happend");
    err.stack.split("\n")[1].must.match(/at .*stack-trace\.spec\.js:39:17/);

    ok(test);
}
catch (e) {
    global.hadError = true;
    error(test, e);
}

try {
    test = "has expected stack trace name and message";
    const MyError = createError("MyError", SyntaxError, { cleanStackTraces: false });

    const err = new MyError("Bad things happend");
    err.stack.split("\n")[0].must.equal("MyError: Bad things happend");

    ok(test);
}
catch (e) {
    global.hadError = true;
    error(test, e);
}

try {
    test = "contains no node-related stack when cleanStackTraces is enabled";
    {
        const MyError = createError("MyError", SyntaxError, { cleanStackTraces: false });

        const err = new MyError("Bad things happend");
        err.stack.must.match(/\(internal/);
    }
    {
        const MyError = createError("MyError", SyntaxError, { cleanStackTraces: true });

        const err = new MyError("Bad things happend");
        err.stack.must.not.match(/\(internal/);
    }

    ok(test);
}
catch (e) {
    global.hadError = true;
    error(test, e);
}

try {
    test = "contains parent message if custom one in not specified";
    const MyError = createError("MyError", SyntaxError, { cleanStackTraces: false });

    const err = new MyError(new TypeError("Bad type"));
    err.stack.split("\n")[0].must.equal("MyError: Bad type");

    ok(test);
}
catch (e) {
    global.hadError = true;
    error(test, e);
}

try {
    test = "works without a message at all";
    const MyError = createError("MyError");

    const err = new MyError();
    err.stack.split("\n")[0].must.equal("MyError");

    ok(test);
}
catch (e) {
    global.hadError = true;
    error(test, e);
}

try {
    test = "works with multiline error message";
    const MyError = createError("MyError");

    const err = new MyError("This is\nlong error\nit really is");
    err.stack.split("\n")[0].must.equal("MyError: This is");
    err.stack.split("\n")[1].must.equal("long error");
    err.stack.split("\n")[2].must.equal("it really is");
    err.stack.split("\n")[3].must.startWith("    at ");
    err.stack.split("\n")[4].must.startWith("    at ");
    (err.stack.split("\n")[5] === undefined).must.be.true();

    ok(test);
}
catch (e) {
    global.hadError = true;
    error(test, e);
}

try {
    test = "works with multiline error message (when created from parent)";
    const MyError = createError("MyError");

    const err = new MyError("This is\nlong error\nit really is", new Error("This\nis two lines only"));
    err.stack.split("\n")[0].must.equal("MyError: This is");
    err.stack.split("\n")[1].must.equal("long error");
    err.stack.split("\n")[2].must.equal("it really is");
    err.stack.split("\n")[3].must.startWith("    at ");
    err.stack.split("\n")[4].must.startWith("    at ");
    (err.stack.split("\n")[5] === undefined).must.be.true();

    ok(test);
}
catch (e) {
    global.hadError = true;
    error(test, e);
}
