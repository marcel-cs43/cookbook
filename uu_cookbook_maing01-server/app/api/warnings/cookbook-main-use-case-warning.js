"use strict";
const CookbookMainUseCaseError = require("../errors/cookbook-main-use-case-error.js");

class CookbookMainUseCaseWarning {
  constructor(code, message, paramMap) {
    this.code = CookbookMainUseCaseError.generateCode(code);
    this.message = message;
    this.paramMap = paramMap instanceof Error ? undefined : paramMap;
  }
}

module.exports = CookbookMainUseCaseWarning;
