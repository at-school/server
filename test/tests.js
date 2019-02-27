/**
 * 
 * This file should include all the tests,
 * write tests in other files and import them here.
 * 
 */

 const assert = require("assert");

 describe("Dummy Test", () => {
     it("Should return number of characters in a string", () => {
         assert.equal("Hello".length, 5);
     });

     it('should return first charachter of the string', function () {
        assert.equal("Hello".charAt(0), 'H');
    });
 });