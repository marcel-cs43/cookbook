"use strict";
const { UseCaseContext } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuTerrClient } = require("uu_territory_clientg01");

const TerritoryConstants = require("../constants/territory-constants");
const DtoBuilder = require("./dto-builder");
const { CookbookMain: Errors } = require("../api/errors/cookbook-main-error");
const Warnings = require("../api/warnings/cookbook-main-warning");
const CookbookMainConstants = require("../constants/cookbook-main-constants");

class CookbookMainClient {
  constructor(uuCookbook, territoryUri = null, session = null) {
    this.dao = DaoFactory.getDao(CookbookMainConstants.Schemas.COOKBOOK_INSTANCE);
    this.uuCookbook = uuCookbook;
    this.uri = UseCaseContext.getUri();
    this.territoryUri = territoryUri ? territoryUri : uuCookbook.uuTerritoryBaseUri;
    this.session = session ? session : UseCaseContext.getSession();
  }

  async createAwsc(location, responsibleRole, permissionMatrix, uuAppMetaModelVersion) {
    const appClientOpts = this.getAppClientOpts();
    const { name, desc } = this.uuCookbook;
    const awscCreateDtoIn = {
      name,
      desc,
      code: `${CookbookMainConstants.AWSC_PREFIX}/${this.uuCookbook.awid}`,
      location,
      responsibleRole,
      permissionMatrix,
      typeCode: CookbookMainConstants.UUAPP_CODE,
      uuAppWorkspaceUri: this.uri.getBaseUri(),
      uuAppMetaModelVersion,
    };

    let awsc;
    try {
      awsc = await UuTerrClient.Awsc.create(awscCreateDtoIn, appClientOpts);
    } catch (e) {
      const awscCreateErrorMap = (e.dtoOut && e.dtoOut.uuAppErrorMap) || {};

      const isDup =
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE] &&
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE].cause &&
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE].cause[TerritoryConstants.NOT_UNIQUE_ID_CODE];

      if (isDup) {
        DtoBuilder.addWarning(new Warnings.Init.UuAwscAlreadyCreated());
        awsc = await UuTerrClient.Awsc.get(
          { code: `${CookbookMainConstants.AWSC_PREFIX}/${this.uuCookbook.awid}` },
          appClientOpts,
        );
      } else {
        DtoBuilder.addUuAppErrorMap(awscCreateErrorMap);
        throw new Errors.CreateAwscFailed(
          { uuTerritoryBaseUri: this.uuCookbook.uuTerritoryBaseUri, awid: this.uuCookbook.awid },
          e,
        );
      }
    }

    this.uuCookbook = await this.dao.updateByAwid({
      awid: this.uuCookbook.awid,
      artifactId: awsc.id,
    });

    return this.uuCookbook;
  }

  async loadAwsc() {
    const appClientOpts = this.getAppClientOpts();

    let awsc;
    try {
      awsc = await UuTerrClient.Awsc.load({ id: this.uuCookbook.artifactId }, appClientOpts);
    } catch (e) {
      throw new Errors.LoadAwscFailed({ artifactId: this.uuCookbook.artifactId }, e);
    }

    return awsc;
  }

  async setAwscState(state) {
    const appClientOpts = this.getAppClientOpts();
    try {
      await UuTerrClient.Awsc.setState(
        {
          id: this.uuCookbook.artifactId,
          state,
        },
        appClientOpts,
      );
    } catch (e) {
      throw new Errors.SetAwscStateFailed({ state, id: this.uuCookbook.artifactId }, e);
    }
  }

  getAppClientOpts() {
    return { baseUri: this.territoryUri, session: this.session, appUri: this.uri };
  }
}

module.exports = CookbookMainClient;
