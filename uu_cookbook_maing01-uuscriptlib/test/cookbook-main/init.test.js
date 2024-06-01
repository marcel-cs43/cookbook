const { TestHelper } = require("uu_script_devkitg01");

describe("CookbookMainInit", () => {
  test("HDS", async () => {
    const session = await TestHelper.login();

    const dtoIn = {};

    const result = await TestHelper.runScript("cookbook-main/init.js", dtoIn, session);
    expect(result.isError).toEqual(false);
  });
});
