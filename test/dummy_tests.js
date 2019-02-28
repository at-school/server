/**
 *
 * This is a dummy test file
 *
 */

const assert = require("assert");

describe("Dummy Test", () => {
    it("Should return number of characters in a string", () => {
        assert.equal("Hello".length, 5);
    });

    it("should return first charachter of the string", function() {
        assert.equal("Hello".charAt(0), "H");
    });
});
