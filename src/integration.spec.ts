import { createError } from "./index.js";

// TS integration tests, they aren't useful in runtime

const MyCoolError = createError<{ t: number }>("MyCoolError");
const OtherError = createError("OtherError", MyCoolError);

describe("TS integration", () => {
    it("must handle instance of", () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const x = new MyCoolError("slo", new Error("kij"));
        const o = new OtherError("slo", new Error("ma"), { dwa: "konce" });

        const handleError = (myerr: ReturnType<typeof OtherError>) => {
            console.error("Got", myerr.details);
        };

        try {
            throw o;
        }
        catch (e: unknown) {
            if (e instanceof OtherError) {
                handleError(e);
            }
        }
    });

    it("must handle creating error by calling as function", () => {
        // eslint-disable-next-line new-cap
        const x = MyCoolError();

        const handleError = (myerr: ReturnType<typeof MyCoolError>) => {
            console.error("Got", myerr);
        };

        try {
            throw x;
        }
        catch (e: unknown) {
            if (e instanceof OtherError) {
                // @ts-expect-error This is just a test
                handleError(e);
            }
        }
    });
});
