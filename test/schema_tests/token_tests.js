const assert = require("assert");
const { schema } = require("../../schema");
/*
const testCases = [
    {
        desc: "Return all tokens",
        query: `
            query {
                tokens {
                    id
                }
            }
        `,
        variables: {},
        context: {},
        expected: {
            data: {
                tokens: [
                    {
                        id: "5c6fa79d4203fb43a7298b90"
                    },
                    {
                        id: "5c6fa8534203fb43a7298b91"
                    }
                ]
            }
        }
    }
];

describe("Token Schema Test Cases", () => {
    // running the test for each case in the cases array
    cases.forEach(obj => {
        const {desc, query, variables, context, expected} = obj;

        it(`Test Case: ${desc}`, async () => {
            const result = await graphql(
                schema,
                query,
                null,
                context,
                variables
            );
            assert.equal(result, expected);
        });
    });
});
*/