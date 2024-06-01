"use strict";

const { Uri } = require("uu_appg01_server").Uri;

// eslint-disable-next-line no-undef
scriptContext.dtoOut = { uuAppErrorMap: {} };
// eslint-disable-next-line no-undef
let { dtoIn, console, dtoOut, session } = scriptContext;

/*@@viewOn:imports*/
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UseCaseError } = require("uu_appg01_server").AppServer;
const { ProgressClient } = require("uu_consoleg02-uulib");

const CookbookMainClient = uuScriptRequire("uu_cookbook_maing01-uuscriptlib/cookbook-main-client", {
  scriptRequireCacheEnabled: false,
});
/*@@viewOff:imports*/

/*@@viewOn:names*/
const Names = {
  SCRIP_LIB_NAME: "uu_cookbook_maing01-uuscriptlib",
  SCRIPT_NAME: "CookbookMainInitRollback",
};
/*@@viewOff:names*/

/*@@viewOn:constants*/
const CMD_NAME = "init";
/*@@viewOff:constants*/

/*@@viewOn:errors*/
const Errors = {
  ERROR_PREFIX: `${Names.SCRIP_LIB_NAME}/${Names.SCRIPT_NAME}/`,

  InvalidDtoIn: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause = null) {
      if (paramMap instanceof Error) {
        cause = paramMap;
        paramMap = {};
      }
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "DtoIn is not valid.";
      this.code = `${Errors.ERROR_PREFIX}invalidDtoIn`;
    }
  },
};
/*@@viewOff:errors*/

/*@@viewOn:scriptClient*/
class CookbookMainInitRollbackClient {
  constructor(lockSecret) {
    this.lockSecret = lockSecret;
    this.progressClient = null;
    this.cookbookMainClient = null;
    this.uuCookbook = null;
  }

  async start() {
    this.cookbookMainClient = new CookbookMainClient(dtoIn.uuCookbookUri);
    this.uuCookbook = await this.cookbookMainClient.load();
    this.progressClient = await ProgressClient.createInstance(
      this.uuCookbook.data.temporaryData.progressMap.uuConsoleUri,
      {
        code: this.uuCookbook.data.temporaryData.progressMap.progressCode,
        lockSecret: this.lockSecret,
      },
      { session }
    );

    return this.uuCookbook;
  }

  async initFinalizeRollback() {
    return this.cookbookMainClient.initFinalizeRollback(this.lockSecret);
  }
}
/*@@viewOff:scriptClient*/

/*@@viewOn:validateDtoIn*/
const DtoInValidationSchema = `const scriptCookbookMainInitRollbackDtoInType = shape({
  uuCookbookUri: string().isRequired(),
  lockSecret: hexa64Code().isRequired(),
})`;

function validateDtoIn(dtoIn, uuAppErrorMap = {}) {
  let dtoInValidator = new Validator(DtoInValidationSchema, true);
  let validationResult = dtoInValidator.validate("scriptCookbookMainInitRollbackDtoInType", dtoIn);
  return ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, `${Errors.ERROR_PREFIX}unsupportedKeys`, Errors.InvalidDtoIn);
}
/*@@viewOff:validateDtoIn*/

/*@@viewOn:helpers*/
/*@@viewOff:helpers*/

async function main() {
  await console.info(`Script uuCookbook initRollback started`);
  dtoOut.dtoIn = dtoIn;
  const uuAppErrorMap = dtoOut.uuAppErrorMap;

  // validates dtoIn
  await console.info(`Validating dtoIn schema.`);
  await console.info(JSON.stringify(dtoIn));

  validateDtoIn(dtoIn, uuAppErrorMap);

  // initialization cookbookMain client and variables
  let mainContext = new CookbookMainInitRollbackClient(dtoIn.lockSecret);
  let uuCookbook = await mainContext.start();

  await console.log(`<uu5string/><UuConsole.Progress baseUri='${Uri.parse(scriptContext.scriptRuntime.getScriptConsoleUri()).baseUri}' progressCode='${mainContext.progressClient.progress.code}' />`);

  // TODO Add steps your application needs here...

  uuCookbook = await mainContext.initFinalizeRollback();

  return { data: uuCookbook, uuAppErrorMap };
}

main();
