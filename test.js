export default function test(message, fn) {
    let success = true;
    const assert = (expected, actual) => {
        if (typeof expected === "object") {
            expected = JSON.stringify(expected);
            actual = JSON.stringify(actual);
        }
        if (expected !== actual) {
            success = false;
            console.error(`\n    expected: ${expected}\n    actual: ${actual}`);
        }
    };

    console.log(`running ${message}`);
    fn(assert);
    if (success) {
        console.log("    succeed");
    }
}