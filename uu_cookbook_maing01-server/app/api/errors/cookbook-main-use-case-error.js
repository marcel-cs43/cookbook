"use strict";
const { UseCaseError, UseCaseContext } = require("uu_appg01_server").AppServer;
const CookbookMainConstants = require("../../constants/cookbook-main-constants.js");

class CookbookMainUseCaseError extends UseCaseError {
  constructor(code, message, paramMap, cause, status = 400, dtoOut) {
    if (paramMap instanceof Error) {
      cause = paramMap;
      paramMap = {};
    }
    if (!dtoOut) {
      dtoOut = { uuAppErrorMap: UseCaseContext.getAttribute(CookbookMainConstants.UU_APP_ERROR_MAP) };
    }
    super({ dtoOut, paramMap, status }, cause);
    this.code = CookbookMainUseCaseError.generateCode(code);
    this.message = message;
  }

  /**
   * Regenerates code based on input URI.
   * This can be used in cases, when URI cannot be passed as input parameter to constructor.
   */
  static generateCode(code) {
    let uri = UseCaseContext.getUri();
    //If the URI is specified and the code does not contain any slash, generate code as <product from URI>/<useCase from URI>/code.
    return code.indexOf("/") < 0 ? `${CookbookMainConstants.ERROR_PREFIX}/${uri.getUseCase()}/${code}` : code;
  }
}

module.exports = CookbookMainUseCaseError;
