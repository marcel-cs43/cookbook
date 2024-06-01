"use strict";
const Crypto = require("crypto");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { AuthenticationService } = require("uu_appg01_server").Authentication;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { UuDateTime } = require("uu_i18ng01");
const { ConsoleClient, ProgressClient } = require("uu_consoleg02-uulib");

const Errors = require("../../api/errors/cookbook-main-error");
const Warnings = require("../../api/warnings/cookbook-main-warning");
const Validator = require("../../components/validator");
const DtoBuilder = require("../../components/dto-builder");
const ScriptEngineClient = require("../../components/script-engine-client");
const CookbookMainClient = require("../../components/cookbook-main-client");
const StepHandler = require("../../components/step-handler");
const InitRollbackAbl = require("./init-rollback-abl");

const ConsoleConstants = require("../../constants/console-constants");
const ProgressConstants = require("../../constants/progress-constants");
const CookbookMainConstants = require("../../constants/cookbook-main-constants");
const Configuration = require("../../components/configuration");

const SCRIPT_CODE = "uu_cookbook_maing01-uuscriptlib/cookbook-main/init";

class InitAbl {
  constructor() {
    this.dao = DaoFactory.getDao(CookbookMainConstants.Schemas.COOKBOOK_INSTANCE);
  }

  async init(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    this._validateDtoIn(uri, dtoIn);

    // HDS 2
    let uuCookbook = await this.dao.getByAwid(awid);
    let uuAppWorkspace = await UuAppWorkspace.get(awid);

    // HDS 3
    this._validateMode(uuCookbook, dtoIn, uuAppWorkspace.sysState);

    // HDS 4
    const configuration = await Configuration.getUuSubAppConfiguration({
      awid,
      artifactId: dtoIn.data.locationId || uuCookbook.temporaryData.dtoIn.locationId,
      uuTerritoryBaseUri: dtoIn.data.uuTerritoryBaseUri || uuCookbook.temporaryData.dtoIn.uuTerritoryBaseUri,
    });

    // HDS 5
    let initData;
    switch (dtoIn.mode) {
      case CookbookMainConstants.ModeMap.STANDARD: {
        initData = dtoIn.data;
        const uuTerritoryBaseUri = this._parseTerritoryUri(initData.uuTerritoryBaseUri);
        const temporaryData = {
          useCase: uri.getUseCase(),
          dtoIn: { ...initData },
          stepList: [CookbookMainConstants.InitStepMap.COOKBOOK_OBJECT_CREATED.code],
          progressMap: {
            uuConsoleUri: configuration.uuConsoleBaseUri,
            progressCode: CookbookMainConstants.getInitProgressCode(awid),
            consoleCode: CookbookMainConstants.getMainConsoleCode(awid),
          },
        };

        uuCookbook = await this.dao.create({
          awid,
          state: CookbookMainConstants.StateMap.CREATED,
          code: `${CookbookMainConstants.AWSC_PREFIX}/${awid}`,
          uuTerritoryBaseUri: uuTerritoryBaseUri.toString(),
          artifactId: dtoIn.data.locationId,
          name: initData.name,
          desc: initData.desc,
          temporaryData,
        });

        try {
          await UuAppWorkspace.setBeingInitializedSysState(awid);
        } catch (e) {
          throw new Errors.Init.SetBeingInitializedSysStateFailed({}, e);
        }
        break;
      }

      case CookbookMainConstants.ModeMap.RETRY: {
        initData = uuCookbook.temporaryData.dtoIn;
        break;
      }

      case CookbookMainConstants.ModeMap.ROLLBACK: {
        uuCookbook.temporaryData.rollbackMode = true;
        if (!uuCookbook.temporaryData.rollbackStepList) {
          uuCookbook.temporaryData.rollbackStepList = [];
        }
        uuCookbook = await this.dao.updateByAwid({ ...uuCookbook });
        initData = uuCookbook.temporaryData.dtoIn;
        break;
      }

      default: {
        throw new Errors.Init.WrongModeAndCircumstances({
          mode: dtoIn.mode,
          appObjectState: uuCookbook?.state,
          temporaryData: uuCookbook?.temporaryData,
        });
      }
    }

    // HDS 6
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const lockSecret = Crypto.randomBytes(32).toString("hex");
    const progressClient = await this._createInitProgress(
      uuCookbook,
      dtoIn,
      configuration,
      lockSecret,
      sysIdentitySession,
    );

    // HDS 7
    switch (dtoIn.mode) {
      case CookbookMainConstants.ModeMap.STANDARD:
      case CookbookMainConstants.ModeMap.RETRY: {
        const stepHandler = new StepHandler({
          schema: CookbookMainConstants.Schemas.COOKBOOK_INSTANCE,
          progressClient,
          stepList: uuCookbook?.temporaryData?.stepList,
        });

        const cookbookMainClient = new CookbookMainClient(uuCookbook, uuCookbook.uuTerritoryBaseUri);

        uuCookbook = await stepHandler.handleStep(uuCookbook, CookbookMainConstants.InitStepMap.AWSC_CREATED, async () => {
          uuCookbook.state = CookbookMainConstants.StateMap.BEING_INITIALIZED;
          await this.dao.updateByAwid({ ...uuCookbook });
          await cookbookMainClient.createAwsc(
            initData.locationId,
            initData.responsibleRoleId,
            initData.permissionMatrix,
            configuration.uuAppMetaModelVersion,
          );
        });

        uuCookbook = await stepHandler.handleStep(uuCookbook, CookbookMainConstants.InitStepMap.WS_CONNECTED, async () => {
          await this._connectAwsc(uuCookbook, uri.getBaseUri(), uuCookbook.uuTerritoryBaseUri, sysIdentitySession);
        });

        uuCookbook = await stepHandler.handleStep(uuCookbook, CookbookMainConstants.InitStepMap.CONSOLE_CREATED, async () => {
          await this._createConsole(uuCookbook, configuration, sysIdentitySession);
        });

        // TODO If your application requires any additional steps, add them here...

        if (!uuCookbook.temporaryData.stepList.includes(CookbookMainConstants.InitStepMap.PROGRESS_ENDED.code)) {
          await this._runScript(uri.getBaseUri(), configuration, lockSecret, sysIdentitySession);
        } else {
          await this._initFinalize(uri, { lockSecret });
        }
        break;
      }

      case CookbookMainConstants.ModeMap.ROLLBACK: {
        if (
          uuCookbook.temporaryData.stepList.includes(CookbookMainConstants.InitStepMap.CONSOLE_CREATED.code) &&
          !uuCookbook.temporaryData.rollbackStepList.includes(CookbookMainConstants.InitRollbackStepMap.CONSOLE_CLEARED.code)
        ) {
          await InitRollbackAbl.initRollback(uri.getBaseUri(), configuration, lockSecret);
        } else {
          await InitRollbackAbl._initFinalizeRollback(uri, { lockSecret });
        }
        break;
      }

      default: {
        throw new Errors.Init.WrongModeAndCircumstances({
          mode: dtoIn.mode,
          appObjectState: uuCookbook?.state,
          temporaryData: uuCookbook?.temporaryData,
        });
      }
    }

    // HDS 8
    return DtoBuilder.prepareDtoOut({ data: uuCookbook });
  }

  async _initFinalize(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    Validator.validateDtoInCustom(uri, dtoIn, "sysUuAppWorkspaceInitFinalizeDtoInType");

    // HDS 2
    let uuCookbook = await this.dao.getByAwid(awid);

    if (!uuCookbook) {
      // 2.1
      throw new Errors._initFinalize.UuCookbookDoesNotExist({ awid });
    }

    if (![CookbookMainConstants.StateMap.BEING_INITIALIZED, CookbookMainConstants.StateMap.ACTIVE].includes(uuCookbook.state)) {
      // 2.2
      throw new Errors._initFinalize.NotInProperState({
        state: uuCookbook.state,
        expectedStateList: [CookbookMainConstants.StateMap.BEING_INITIALIZED, CookbookMainConstants.StateMap.ACTIVE],
      });
    }

    // HDS 3
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const progress = {
      code: CookbookMainConstants.getInitProgressCode(uuCookbook.awid),
      lockSecret: dtoIn.lockSecret,
    };
    let progressClient = null;
    if (!uuCookbook.temporaryData.stepList.includes(CookbookMainConstants.InitStepMap.PROGRESS_ENDED.code)) {
      progressClient = await ProgressClient.get(uuCookbook.temporaryData.progressMap.uuConsoleUri, progress, {
        session: sysIdentitySession,
      });
    }
    const stepHandler = new StepHandler({
      schema: CookbookMainConstants.Schemas.COOKBOOK_INSTANCE,
      progressClient,
      stepList: uuCookbook.temporaryData.stepList,
    });

    // TODO If your application requires any additional steps, add them here...

    // HDS 4
    uuCookbook = await stepHandler.handleStep(
      uuCookbook,
      CookbookMainConstants.InitStepMap.PROGRESS_ENDED,
      async () => {
        await progressClient.end({
          state: ProgressConstants.StateMap.COMPLETED,
          message: "Initialization finished.",
          doneWork: CookbookMainConstants.getInitStepCount(),
        });
      },
      false,
    );

    // HDS 5
    if (uuCookbook.state === CookbookMainConstants.StateMap.BEING_INITIALIZED) {
      uuCookbook = await this.dao.updateByAwid({ awid, state: CookbookMainConstants.StateMap.ACTIVE, temporaryData: null });
    }

    // HDS 6
    await UuAppWorkspace.setActiveSysState(awid);

    // HDS 7
    return DtoBuilder.prepareDtoOut({ data: uuCookbook });
  }

  // Validates dtoIn. In case of standard mode the data key of dtoIn is also validated.
  _validateDtoIn(uri, dtoIn) {
    let uuAppErrorMap = Validator.validateDtoIn(uri, dtoIn);
    if (dtoIn.mode === CookbookMainConstants.ModeMap.STANDARD) {
      Validator.validateDtoInCustom(uri, dtoIn.data, "sysUuAppWorkspaceInitStandardDtoInType", uuAppErrorMap);
    }
    return uuAppErrorMap;
  }

  _validateMode(uuCookbook, dtoIn, sysState) {
    switch (dtoIn.mode) {
      case CookbookMainConstants.ModeMap.STANDARD:
        if (![UuAppWorkspace.SYS_STATES.ASSIGNED, UuAppWorkspace.SYS_STATES.BEING_INITIALIZED].includes(sysState)) {
          // 3.A.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.ASSIGNED, UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (uuCookbook) {
          // 3.A.2.1.
          throw new Errors.Init.UuCookbookObjectAlreadyExist({
            mode: dtoIn.mode,
            allowedModeList: [CookbookMainConstants.ModeMap.RETRY, CookbookMainConstants.ModeMap.ROLLBACK],
          });
        }
        break;

      case CookbookMainConstants.ModeMap.RETRY:
        if (sysState !== UuAppWorkspace.SYS_STATES.BEING_INITIALIZED) {
          // 3.B.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (!uuCookbook?.temporaryData) {
          // 3.B.2.1.
          throw new Errors.Init.MissingRequiredData();
        }
        if (uuCookbook?.temporaryData?.rollbackMode) {
          // 3.B.3.1.
          throw new Errors.Init.RollbackNotFinished();
        }
        break;

      case CookbookMainConstants.ModeMap.ROLLBACK:
        if (sysState !== UuAppWorkspace.SYS_STATES.BEING_INITIALIZED) {
          // 3.C.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (!uuCookbook?.temporaryData) {
          // 3.C.2.1.
          throw new Errors.Init.MissingRequiredData();
        }
        if (!dtoIn.force && uuCookbook?.temporaryData?.rollbackMode) {
          // 3.C.3.1.
          throw new Errors.Init.RollbackAlreadyRunning();
        }
        break;
    }
  }

  _parseTerritoryUri(locationUri) {
    let uuTerritoryUri;

    try {
      uuTerritoryUri = UriBuilder.parse(locationUri).toUri();
    } catch (e) {
      throw new Errors.Init.UuTLocationUriParseFailed({ uri: locationUri }, e);
    }

    return uuTerritoryUri.getBaseUri();
  }

  async _createInitProgress(uuCookbook, dtoIn, config, lockSecret, session) {
    let progressClient;
    let progress = {
      expireAt: UuDateTime.now().shiftDay(7),
      name: CookbookMainConstants.getInitProgressName(uuCookbook.awid),
      code: CookbookMainConstants.getInitProgressCode(uuCookbook.awid),
      authorizationStrategy: "uuIdentityList",
      permissionMap: await this._getInitProgressPermissionMap(uuCookbook.awid, session),
      lockSecret,
    };

    try {
      progressClient = await ProgressClient.get(config.uuConsoleBaseUri, { code: progress.code }, { session });
    } catch (e) {
      if (e.cause?.code !== ProgressConstants.PROGRESS_DOES_NOT_EXIST) {
        throw new Errors.Init.ProgressGetCallFailed({ code: progress.code }, e);
      }
    }

    if (!progressClient) {
      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.Init.ProgressCreateCallFailed({ code: progress.code }, e);
      }
    } else if (dtoIn.force) {
      try {
        await progressClient.releaseLock();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_RELEASE_DOES_NOT_EXIST) {
          throw new Errors.Init.ProgressReleaseLockCallFailed({ code: progress.code }, e);
        }
      }

      try {
        await progressClient.setState({ state: "cancelled" });
      } catch (e) {
        DtoBuilder.addWarning(new Warnings.Init.ProgressSetStateCallFailed(e.cause?.paramMap));
      }

      try {
        await progressClient.delete();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_DELETE_DOES_NOT_EXIST) {
          throw new Errors.Init.ProgressDeleteCallFailed({ code: progress.code }, e);
        }
      }

      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.Init.ProgressCreateCallFailed({ code: progress.code }, e);
      }
    }

    try {
      await progressClient.start({
        message: "Progress was started",
        totalWork:
          dtoIn.mode === CookbookMainConstants.ModeMap.ROLLBACK
            ? CookbookMainConstants.getInitRollbackStepCount()
            : CookbookMainConstants.getInitStepCount(),
        lockSecret,
      });
    } catch (e) {
      throw new Errors.Init.ProgressStartCallFailed({ code: progress.code }, e);
    }

    return progressClient;
  }

  async _getInitProgressPermissionMap(awid, sysIdentitySession) {
    const awidData = await UuAppWorkspace.get(awid);

    let permissionMap = {};
    for (let identity of awidData.awidInitiatorList) {
      permissionMap[identity] = CookbookMainConstants.CONSOLE_BOUND_MATRIX.Authorities;
    }
    permissionMap[sysIdentitySession.getIdentity().getUuIdentity()] =
      CookbookMainConstants.CONSOLE_BOUND_MATRIX.Authorities;

    return permissionMap;
  }

  async _connectAwsc(uuCookbook, appUri, uuTerritoryBaseUri, session) {
    const artifactUri = UriBuilder.parse(uuTerritoryBaseUri).setParameter("id", uuCookbook.artifactId).toUri().toString();

    try {
      await UuAppWorkspace.connectArtifact(appUri, { artifactUri }, session);
    } catch (e) {
      throw new Errors.CookbookMain.ConnectAwscFailed(
        {
          awid: uuCookbook.awid,
          awscId: uuCookbook.artifactId,
          uuTerritoryBaseUri,
        },
        e,
      );
    }
  }

  async _createConsole(uuCookbook, configuration, session) {
    const artifactUri = UriBuilder.parse(uuCookbook.uuTerritoryBaseUri).setParameter("id", uuCookbook.artifactId).toString();
    const console = {
      code: CookbookMainConstants.getMainConsoleCode(uuCookbook.awid),
      authorizationStrategy: "boundArtifact",
      boundArtifactUri: artifactUri,
      boundArtifactPermissionMatrix: CookbookMainConstants.CONSOLE_BOUND_MATRIX,
    };

    try {
      await ConsoleClient.createInstance(configuration.uuConsoleBaseUri, console, { session });
    } catch (e) {
      throw new Errors.Init.FailedToCreateConsole({}, e);
    }
  }

  async _setConsoleExpiration(uuConsoleUri, consoleCode, session) {
    let consoleClient;
    try {
      consoleClient = await ConsoleClient.get(uuConsoleUri, { code: consoleCode }, { session });
    } catch (e) {
      if (e.cause?.code === ConsoleConstants.CONSOLE_GET_DOES_NOT_EXISTS) {
        throw new Errors._initFinalize.ConsoleGetCallFailed({ code: consoleCode }, e);
      }
    }

    try {
      await consoleClient.update({ expireAt: new UuDateTime().shiftDay(7).date });
    } catch (e) {
      if (e.cause?.code === ConsoleConstants.CONSOLE_UPDATE_DOES_NOT_EXISTS) {
        DtoBuilder.addWarning(new Warnings._initFinalize.ConsoleDoesNotExist({ code: consoleCode }));
      } else {
        throw new Errors._initFinalize.ConsoleUpdateCallFailed({ code: consoleCode }, e);
      }
    }
  }

  async _runScript(appUri, configuration, lockSecret, session) {
    const scriptEngineClient = new ScriptEngineClient({
      scriptEngineUri: configuration.uuScriptEngineBaseUri,
      consoleUri: configuration.uuConsoleBaseUri,
      consoleCode: CookbookMainConstants.getMainConsoleCode(appUri.getAwid()),
      scriptRepositoryUri: configuration.uuScriptRepositoryBaseUri,
      session,
    });

    const scriptDtoIn = {
      uuCookbookUri: appUri.toString(),
      lockSecret,
    };

    await scriptEngineClient.runScript({ scriptCode: SCRIPT_CODE, scriptDtoIn });
  }
}

module.exports = new InitAbl();
