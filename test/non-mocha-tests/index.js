require("./bootstrap");
global.hadError = false;
require("./stack-trace.spec");

if (global.hadError) {
    process.exit(1); // eslint-disable-line no-process-exit
}
