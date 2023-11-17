import { createError } from "./index.js";

describe("createError", () => {
    it("createError should return a function", () => {
        const MyError = createError("MyError");
        MyError.must.be.a.function();
    });

    it("should set correct name", () => {
        const MyCustomError = createError("MyError");
        const err = new MyCustomError();
        err.name.must.equal("MyError");
        MyCustomError.name.must.equal("MyError");
    });

    it("instanceof should detect parent `class`", () => {
        const MyError = createError("MyError");
        const my = new MyError();
        my.must.be.instanceOf(Error);

        const MySyntaxError = createError("MyError", SyntaxError);
        const syntax = new MySyntaxError();
        syntax.must.be.instanceOf(SyntaxError);
        syntax.name.must.equal("MyError");
    });

    it("instanceof should detect parent `class` which was extended by createError", () => {
        const MyError = createError("MyError");
        const YourError = createError("YourError", MyError);
        const your = new YourError();
        your.must.be.instanceOf(Error);
        your.must.be.instanceOf(MyError);
        your.must.be.instanceOf(YourError);
    });

    it("has extend helper method", function() {
        const MyError = createError("MyError");
        const YourError = MyError.extend("YourError");
        const your = new YourError();
        your.must.be.instanceOf(Error);
        your.must.be.instanceOf(MyError);
        your.must.be.instanceOf(YourError);
    });

    it("should allow to access parent errors", function() {
        const MyError = createError("MyError");
        const YourError = MyError.extend("YourError");
        const your = new YourError("your", new MyError("my", new Error("standard")));
        your.parent.must.be.instanceOf(MyError);
        your.parent.message.must.equal("my");
        your.parent.parent.must.be.instanceOf(Error);
        your.parent.parent.message.must.equal("standard");
    });

    it("should store names hierarchy with error", () => {
        const MyError = createError("MyError", TypeError);
        const YourError = createError("YourError", MyError);
        const HerError = createError("HerError", YourError);
        const your = new HerError("kaka");
        your.names.must.be.eql([
            "HerError",
            "YourError",
            "MyError",
            "TypeError",
            "Error",
        ]);
    });

    it("allows invoking created error as function (just like standard error allows)", () => {
        const MyError = createError("MyError", TypeError);
        const error = MyError("Hi"); // eslint-disable-line new-cap

        error.must.be.instanceOf(MyError);
        error.must.be.instanceOf(TypeError);
        error.must.be.instanceOf(Error);
        error.names.must.be.eql([
            "MyError",
            "TypeError",
            "Error",
        ]);

        error.message.must.equal("Hi");
    });

    it("sets message", () => {
        const MyError = createError("MyError", TypeError);

        {
            const error = new MyError("Something is wrong");
            error.message.must.equal("Something is wrong");
        }

        {
            const error = new MyError(null, null, "Something is wrong");
            error.message.must.equal("Something is wrong");
        }

        {
            const error = new MyError(null, "Something is wrong", null);
            error.message.must.equal("Something is wrong");
        }
    });

    it("sets details", () => {
        const MyError = createError("MyError", TypeError);

        {
            const details = { a: 5 };
            const error = new MyError("Something is wrong", details);
            error.details.must.equal(details);
        }

        {
            const details = { b: 5 };
            const error = new MyError(details);
            error.details.must.equal(details);
        }

        {
            const details = { c: 5 };
            const error = new MyError(null, details);
            error.message.must.equal("");
            error.details.must.equal(details);
        }

        {
            const details = { d: 5 };
            const error = new MyError(null, null, details);
            error.message.must.equal("");
            error.details.must.equal(details);
        }

        {
            const details = { e: 5 };
            const error = new MyError(details, null, null);
            error.message.must.equal("");
            error.details.must.equal(details);
        }

        {
            const details = { e: 5 };
            const error = new MyError(null, details, null);
            error.message.must.equal("");
            error.details.must.equal(details);
        }
    });

    it("allows to create error from another error instance, without extending", () => {
        {
            const DatabaseError = createError("DatabaseError");
            const InternalServerError = createError("InternalServerError");

            const dbError = new DatabaseError("DB connection lost.");
            const error = new InternalServerError(dbError, "Cannot get articles");

            error.message.must.equal("Cannot get articles");
            error.must.be.instanceOf(InternalServerError);
            error.must.not.be.instanceOf(DatabaseError);
            error.names.must.eql([
                "InternalServerError",
                [
                    "DatabaseError", "Error",
                ],
                "Error",
            ]);
            String(error.names).must.equal("(InternalServerError,(DatabaseError,Error),Error)");
        }

        {
            const InternalServerError = createError("InternalServerError");

            const dbError = new TypeError("DB connection lost.");
            const error = new InternalServerError(dbError, "Cannot get articles");

            error.message.must.equal("Cannot get articles");
            error.must.be.instanceOf(InternalServerError);
            error.must.not.be.instanceOf(TypeError);
            error.names.must.eql([
                "InternalServerError",
                [
                    "TypeError", "Error",
                ],
                "Error",
            ]);
            String(error.names).must.equal("(InternalServerError,(TypeError,Error),Error)");
        }
    });

    it("allows mixing arguments order and omitting any with null/undefined", () => {
        /* eslint-disable new-cap */
        {
            const MyError = createError("MyError", TypeError);
            const YourError = createError("YourError", MyError);
            const HerError = createError("HerError");

            {
                const exampleMyError = MyError("This is my error", { data: true, x: 5 });
                const error = YourError(exampleMyError, { data: "overridden" }, "Message overridden");

                error.must.be.instanceOf(YourError);
                error.must.be.instanceOf(MyError);
                error.message.must.equal("Message overridden");
                error.details.must.eql({ data: "overridden" });
                error.names.must.eql([
                    "YourError",
                    ["MyError", "TypeError", "Error"],
                    "MyError",
                    "TypeError",
                    "Error",
                ]);
            }

            {
                const exampleMyError = MyError("This is my error", null, { data: true, x: 5 });
                const error = YourError(exampleMyError);

                error.must.be.instanceOf(YourError);
                error.must.be.instanceOf(MyError);
                error.message.must.equal("This is my error");
                error.details.must.eql({ data: true, x: 5 });
                error.names.must.eql([
                    "YourError",
                    ["MyError", "TypeError", "Error"],
                    "MyError",
                    "TypeError",
                    "Error",
                ]);
            }

            {
                const exampleMyError = MyError({ data: false, x: 5 }, new SyntaxError("Wrong syntax"), "This is ERROR");
                const error = new HerError(null, "I don't blame people, but this is her error", exampleMyError);

                error.must.be.instanceOf(HerError);
                error.must.not.be.instanceOf(MyError);
                error.message.must.equal("I don't blame people, but this is her error");
                error.details.must.eql({ data: false, x: 5 });
                error.names.must.eql([
                    "HerError",
                    [
                        "MyError",
                        [
                            "SyntaxError",
                            "Error",
                        ],
                        "TypeError", "Error",
                    ],
                    "Error",
                ]);
            }

            {
                const exampleMyError = MyError({ data: false, x: 5 }, new SyntaxError("Wrong syntax"));
                const error = new HerError({}, undefined, exampleMyError);

                error.must.be.instanceOf(HerError);
                error.must.not.be.instanceOf(MyError);
                error.message.must.equal("Wrong syntax");
                error.details.must.eql({});
                error.names.must.eql([
                    "HerError",
                    [
                        "MyError",
                        [
                            "SyntaxError",
                            "Error",
                        ],
                        "TypeError", "Error",
                    ],
                    "Error",
                ]);
            }
        }
        /* eslint-enable new-cap */
    });

    it("has non-enumerable properties", () => {
        const MyError = createError("MyError", SyntaxError);
        const error = new MyError("abc", { a: 5 }, new TypeError("xxx"));

        Object.keys(error).must.eql([]);
    });

    it("should have the same stack trace as native error", function() {
        const MyError = createError("MyError", SyntaxError, { cleanStackTraces: false });
        const error = new MyError("abc");
        const nativeError = new Error("abc");

        const customStack = error.stack.split("\n");
        customStack.shift();
        const firstCustom = customStack.shift();

        const nativeStack = nativeError.stack.split("\n");
        nativeStack.shift();
        const firstNative = nativeStack.shift();

        nativeStack.must.eql(customStack);
        let differentCharacters = 0;
        for (let i = 0; i < firstCustom.length; i++) {
            if (firstCustom[i] !== firstNative[i]) {
                differentCharacters++;
            }
        }
        differentCharacters.must.be.between(1, 2);
    });

    it("should cut out node-specific stack traces", function(done) {
        const MyDirtyError = createError("MyDirtyError", SyntaxError, { cleanStackTraces: false });
        const MyCleanError = createError("MyCleanError", SyntaxError, { cleanStackTraces: true });

        setImmediate(() => {
            const cleanError = new MyCleanError("abc");
            cleanError.stack.must.not.include("node:internal");
            const dirtyError = new MyDirtyError("abc");
            dirtyError.stack.must.include("node:internal");
            done();
        });
    });

    describe("normalizes the error", function() {
        const MyError = createError("MyError");

        const notErrorButString = "something";
        const notErrorButObject = { a: 5 };

        const notErrorButStrictlyConvincing = {};
        Object.defineProperties(notErrorButStrictlyConvincing, {
            name: { value: "LooksLikeError", enumerable: false },
            message: { value: "I faked myself as error", enumerable: false },
            stack: { value: "something", enumerable: false },
        });

        const notErrorButLooselyConvincing = {};
        Object.defineProperties(notErrorButLooselyConvincing, {
            name: { value: 1234, enumerable: true },
            message: { value: true, enumerable: true },
            stack: { value: null, enumerable: true },
        });

        describe("with default strict mode", () => {
            it("normalizes non-errors", () => {
                const stringNormalized = MyError.normalize(notErrorButString);
                stringNormalized.must.be.instanceof(MyError);
                stringNormalized.message.must.equal("Not an error: something");

                const objNormalized = MyError.normalize(notErrorButObject);
                objNormalized.must.be.instanceof(MyError);
                objNormalized.message.must.equal("Not an error: [object Object]");
            });

            it("keeps errors", async () => {
                const myError = new MyError();
                const normalized = MyError.normalize(myError);
                myError.must.equal(normalized);

                const standardError = new Error("Standard error");
                const standardNormalized = MyError.normalize(standardError);
                standardNormalized.must.be.instanceof(Error);
                standardNormalized.message.must.equal("Standard error");
            });

            it("keeps error look alikes", async () => {
                const error = MyError.normalize(notErrorButStrictlyConvincing);
                error.must.not.be.instanceof(MyError);
                error.must.equal(notErrorButStrictlyConvincing);
            });

            it("rejects low quality disguise", async () => {
                const error = MyError.normalize(notErrorButLooselyConvincing);
                error.must.be.instanceof(MyError);
                error.message.must.equal("Not an error: [object Object]");
            });
        });

        describe("with instanceof mode", () => {
            it("normalizes non-errors", () => {
                const stringNormalized = MyError.normalize(notErrorButString, { mode: "instanceof" });
                stringNormalized.must.be.instanceof(MyError);
                stringNormalized.message.must.equal("Not an error: something");

                const objNormalized = MyError.normalize(notErrorButObject, { mode: "instanceof" });
                objNormalized.must.be.instanceof(MyError);
                objNormalized.message.must.equal("Not an error: [object Object]");
            });

            it("keeps errors", async () => {
                const myError = new MyError();
                const normalized = MyError.normalize(myError, { mode: "instanceof" });
                myError.must.equal(normalized);

                const standardError = new Error("Standard error");
                const standardNormalized = MyError.normalize(standardError, { mode: "instanceof" });
                standardNormalized.must.be.instanceof(Error);
                standardNormalized.message.must.equal("Standard error");
            });

            it("rejects error look alikes", async () => {
                const error = MyError.normalize(notErrorButStrictlyConvincing, { mode: "instanceof" });
                error.must.be.instanceof(MyError);
                error.message.must.equal("Not an error: [object Object]");
            });

            it("rejects low quality disguise", async () => {
                const error = MyError.normalize(notErrorButLooselyConvincing, { mode: "instanceof" });
                error.must.be.instanceof(MyError);
                error.message.must.equal("Not an error: [object Object]");
            });
        });

        describe("with loose mode", () => {
            it("normalizes non-errors", () => {
                const stringNormalized = MyError.normalize(notErrorButString, { mode: "loose" });
                stringNormalized.must.be.instanceof(MyError);
                stringNormalized.message.must.equal("Not an error: something");

                const objNormalized = MyError.normalize(notErrorButObject, { mode: "loose" });
                objNormalized.must.be.instanceof(MyError);
                objNormalized.message.must.equal("Not an error: [object Object]");
            });

            it("keeps errors", async () => {
                const myError = new MyError();
                const normalized = MyError.normalize(myError, { mode: "loose" });
                myError.must.equal(normalized);

                const standardError = new Error("Standard error");
                const standardNormalized = MyError.normalize(standardError, { mode: "loose" });
                standardNormalized.must.be.instanceof(Error);
                standardNormalized.message.must.equal("Standard error");
            });

            it("keeps error look alikes", async () => {
                const error = MyError.normalize(notErrorButStrictlyConvincing, { mode: "loose" });
                error.must.not.be.instanceof(MyError);
                error.must.equal(notErrorButStrictlyConvincing);
            });

            it("keeps low quality disguise", async () => {
                const error = MyError.normalize(notErrorButLooselyConvincing, { mode: "loose" });
                error.must.not.be.instanceof(MyError);
                error.must.equal(notErrorButLooselyConvincing);
            });
        });
    });

    it("doesn't allow to pass multiple values of the same type", function() {
        const MyError = createError("MyError");
        // eslint-disable-next-line no-new
        (() => { new MyError("Something went wrong.", "Really wrong."); }).must.throw(
            TypeError, "Invalid arguments passed into error",
        );
    });

    it("returns ancestors", function() {
        const DatabaseError = createError("DatabaseError");
        const QueryError = DatabaseError.extend("QueryError");

        const tcpError = new Error("TCP Error");
        const databaseError = new DatabaseError("Cannot connect", null, tcpError);
        const queryError = new QueryError("Query failed", null, databaseError);

        queryError.ancestors.must.eql([databaseError, tcpError]);
    });

    it("stringifies well", async () => {
        const MyError = createError("MyError", SyntaxError);
        const err = new MyError("abc", { a: 5 }, new TypeError("xxx"));
        String(err).must.equal("MyError: abc");
    });
});

describe.skip("(TypeScript tests)", () => {
    it("works with interfaces without index", async () => {
        interface SwitchesSchema {
            name: string;
        }

        const config: SwitchesSchema = {
            name: "xd",
        };

        const SwitchError = createError("SwitchError");
        Math.random() === -1 && new SwitchError("Unknown switch type", config);
    });

    it("disallows unexpected data when defined as interface", async () => {
        interface SwitchesSchema {
            name: string;
        }

        const SwitchError = createError<SwitchesSchema>("SwitchError");
        Math.random() === -1 && new SwitchError("Unknown switch type", { a: "b" });
        Math.random() === -1 && new SwitchError("Unknown switch type", { name: "b" });
        Math.random() === -1 && new SwitchError("Unknown switch type", { name: "b", c: "d" });
    });

    it("disallows unexpected data when defined as type", async () => {
        type SwitchesSchema = {
            name: string;
        };

        const SwitchError = createError<SwitchesSchema>("SwitchError");
        Math.random() === -1 && new SwitchError("Unknown switch type", { a: "b" });
        Math.random() === -1 && new SwitchError("Unknown switch type", { name: "b" });
        Math.random() === -1 && new SwitchError("Unknown switch type", { name: "b", c: "d" });
    });
});
