"use strict";

//@@viewOn:constants
const CookbookMainConstants = {
  AWSC_PREFIX: "uu-cookbook",
  CONSOLE_PREFIX: "cookbook",
  ERROR_PREFIX: "uu-cookbook-main",
  INIT_PROGRESS_CODE_PREFIX: "uu-cookbook-maing01-progress-init-",
  INIT_PROGRESS_NAME_PREFIX: "uuCookbook Init ",
  UUAPP_CODE: "uu-cookbook-maing01",

  CONFIG_CACHE_KEY: "configuration",
  UU_APP_ERROR_MAP: "uuAppErrorMap",

  // This is bound matrix of uuAwsc and uuConsole which has authorization bounded to that uuAwsc.
  CONSOLE_BOUND_MATRIX: {
    Authorities: ["Authorities", "Readers", "Writers"],
    Operatives: ["Readers", "Writers"],
    Auditors: ["Readers"],
    SystemIdentity: ["Authorities", "Readers", "Writers"],
  },

  InitStepMap: {
    COOKBOOK_OBJECT_CREATED: { code: "uuCookbookObjectCreated", message: "The uuObject of uuCookbook created." },
    AWSC_CREATED: { code: "uuAwscCreated", message: "The uuAwsc of uuCookbook created." },
    WS_CONNECTED: { code: "uuAppWorkspaceConnected", message: "The uuCookbook uuAppWorkspace connected." },
    CONSOLE_CREATED: { code: "consoleCreated", message: "The console of uuCookbook created." },
    PROGRESS_ENDED: { code: "progressEnded", message: "The progress has been ended." },
    WS_ACTIVE: { code: "uuAppWorkspaceActiveState", message: "The uuAppWorkspace of uuCookbook set to active state." },
  },

  InitRollbackStepMap: {
    CONSOLE_CLEARED: { code: "consoleCleared", message: "The uuCookbook console has been cleared." },
    WS_DISCONNECTED: { code: "uuAppWorkspaceDisonnected", message: "The uuCookbook uuAppWorkspace disconnected." },
    AWSC_DELETED: { code: "uuAwscDeleted", message: "The uuAwsc of uuCookbook deleted." },
    PROGRESS_DELETED: { code: "progressDeleted", message: "The progress has been deleted." },
  },

  ModeMap: {
    STANDARD: "standard",
    RETRY: "retry",
    ROLLBACK: "rollback",
  },

  ProfileMask: {
    STANDARD_USER: parseInt("00010000000000000000000000000000", 2),
  },

  PropertyMap: {
    CONFIG: "config",
    SCRIPT_CONFIG: "scriptConfig",
    COOKBOOK_CONFIG: "uuCookbookConfig",
  },

  Schemas: {
    COOKBOOK_INSTANCE: "cookbookMain",
  },

  SharedResources: {
    SCRIPT_CONSOLE: "uu-console-maing02",
    SCRIPT_ENGINE: "uu-script-engineg02",
  },

  StateMap: {
    CREATED: "created",
    BEING_INITIALIZED: "beingInitialized",
    ACTIVE: "active",
    FINAL: "closed",
  },

  getMainConsoleCode: (awid) => {
    return `uu-cookbook-maing01-console-${awid}`;
  },

  getInitProgressCode: (awid) => {
    return `${CookbookMainConstants.INIT_PROGRESS_CODE_PREFIX}${awid}`;
  },

  getInitProgressName: (awid) => {
    return `${CookbookMainConstants.INIT_PROGRESS_NAME_PREFIX}${awid}`;
  },

  getInitStepCount: () => {
    return Object.keys(CookbookMainConstants.InitStepMap).length;
  },

  getInitRollbackStepCount: () => {
    return Object.keys(CookbookMainConstants.InitRollbackStepMap).length;
  },
};
//@@viewOff:constants

//@@viewOn:exports
module.exports = CookbookMainConstants;
//@@viewOff:exports
