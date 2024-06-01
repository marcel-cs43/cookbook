"use strict";
const CookbookMainUseCaseError = require("./cookbook-main-use-case-error.js");

class InvalidDtoIn extends CookbookMainUseCaseError {
  constructor(dtoOut, paramMap = {}, cause = null) {
    super("invalidDtoIn", "DtoIn is not valid.", paramMap, cause, undefined, dtoOut);
  }
}

module.exports = {
  InvalidDtoIn,
};
