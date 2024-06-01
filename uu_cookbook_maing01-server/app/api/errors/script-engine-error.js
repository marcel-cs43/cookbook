"use strict";
const CookbookMainUseCaseError = require("./cookbook-main-use-case-error.js");

class CallScriptEngineFailed extends CookbookMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("callScriptEngineFailed", "Call scriptEngine failed.", paramMap, cause);
  }
}

module.exports = {
  CallScriptEngineFailed,
};
