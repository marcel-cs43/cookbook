const AppClient = require("uu_appg01_server").AppClient;
const { UseCaseError } = require("uu_appg01_server").AppServer;

const { session, dtoOut } = scriptContext;

/*@@viewOn:names*/
const Names = {
  SCRIPT_LIB_NAME: "uu_cookbook_maing01-uuscriptlib",
  CLASS_NAME: "CookbookMainClient",
};
/*@@viewOff:names*/

/*@@viewOn:errors*/
const Errors = {
  ERROR_PREFIX: `${Names.SCRIPT_LIB_NAME}/${Names.CLASS_NAME}/`,

  LoadUuCookbookFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/load failed.";
      this.code = `${Errors.ERROR_PREFIX}loadUuCookbookFailed`;
    }
  },

  GetUuCookbookFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/get failed.";
      this.code = `${Errors.ERROR_PREFIX}getUuCookbookFailed`;
    }
  },

  InitFinalizeFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/_initFinalize failed.";
      this.code = `${Errors.ERROR_PREFIX}initFinalizeFailed`;
    }
  },

  InitFinalizeRollbackFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/_initFinalizeRollback failed.";
      this.code = `${Errors.ERROR_PREFIX}initFinalizeRollbackFailed`;
    }
  },
};

/*@@viewOff:errors*/

class CookbookMainClient {
  constructor(baseUri) {
    this.appClient = new AppClient({ baseUri, session });
    // base uri can be used as parameter in error
    this.baseUri = baseUri;
  }

  async load() {
    let cookbook;
    try {
      cookbook = await this.appClient.cmdGet("sys/uuAppWorkspace/load");
    } catch (e) {
      throw new Errors.LoadUuCookbookFailed({ baseUri: this.baseUri }, e);
    }
    return cookbook;
  }

  async get() {
    let cookbook;
    try {
      cookbook = await this.appClient.cmdGet("sys/uuAppWorkspace/get");
    } catch (e) {
      throw new Errors.GetUuCookbookFailed({ baseUri: this.baseUri }, e);
    }
    return cookbook;
  }

  async initFinalize(lockSecret) {
    let cookbook;
    try {
      cookbook = await this.appClient.cmdPost("sys/uuAppWorkspace/_initFinalize", { lockSecret });
    } catch (e) {
      throw new Errors.InitFinalizeFailed({ baseUri: this.baseUri }, e);
    }
    return cookbook;
  }

  async initFinalizeRollback(lockSecret) {
    let cookbook;
    try {
      cookbook = await this.appClient.cmdPost("sys/uuAppWorkspace/_initFinalizeRollback", { lockSecret });
    } catch (e) {
      throw new Errors.InitFinalizeRollbackFailed({ baseUri: this.baseUri }, e);
    }
    return cookbook;
  }
}

module.exports = CookbookMainClient;
