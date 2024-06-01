export default {
  notAuthorized: {
    cs: "Nemáte dostatečná práva k použití aplikace.",
    en: "You do not have sufficient rights to use the application.",
  },

  formHeader: {
    cs: "Inicializovat aplikaci",
    en: "Initialize uuApp",
  },

  waitForConsoleInfo: { en: "Console would be created in one of the next steps ..." },

  deleteFormHeader: {
    cs: "Smazat aplikaci",
    en: "Delete uuApp",
  },

  infoHeader: {
    cs: "Info o uuAppWorkspace",
    en: "uuAppWorkspace Info",
  },

  formHeaderInfo: {
    cs: `<uu5string/>Vaše uuApp běží, ale vyžaduje inicializaci. Pokud potřebujete pomoci s vyplněním tohoto formuláře, podívejte se do
<Uu5Elements.Link target="_blank" href="#">Dokumentace</Uu5Elements.Link>.`,
    en: `<uu5string/>Your uuApp is running, but requires initialization. If you need help with filling up this form, see
<Uu5Elements.Link target="_blank" href="#">Documentation</Uu5Elements.Link>.`,
  },

  authorizedForInit: {
    cs: `<uu5string/>
        <Uu5Elements.HighlightedBox colorScheme="warning">
          Vaše uuApp běží, ale vyžaduje inicializaci, máte práva inicializovat uuApp.
        </Uu5Elements.HighlightedBox>`,
    en: `<uu5string/>
        <Uu5Elements.HighlightedBox colorScheme="warning">
          Your uuApp is running, but requires initialization, you are authorized to initialize uuApp.
        </Uu5Elements.HighlightedBox>`,
  },

  notInitializedHeader: {
    cs: "uuAppWorkspace nebyl inicializován",
    en: "uuAppWorkspace not initialized",
  },

  authorizedInfo: {
    cs: (name) =>
      `Jste oprávněni inicializovat ${name}. Inicializaci zahájíte kliknutím na tlačítko "Inicializovat". Chcete-li získat další informace, klikněte na "Podrobnější info".`,
    en: (name) =>
      `You are authorized to initialize ${name}. To start initialization, click "Initialize". To get more info, click "Get Info".`,
  },

  beingInitializedHeader: {
    cs: "uuAppWorkspace je právě inicializován",
    en: "uuAppWorkspace is being initialized",
  },

  beingInitializedAuthorizedInfo: {
    cs: (name) =>
      `Jste oprávněni inicializovat ${name}. Chcete-li inicializaci změnit, klikněte na tlačítko "Opakujte inicializaci" nebo "Inicializace vrácení zpět". Chcete-li získat další informace, klikněte na "Podrobnější info".`,
    en: (name) =>
      `You are authorized to initialize ${name}. To change initialization, click "Retry" or "Rollback". To get more info, click "Get Info".`,
  },

  notAuthorizedInfo: {
    cs: "Nemáte oprávnění k inicializaci uuAppWorkspace.",
    en: "You are not authorized to initialize this uuAppWorkspace.",
  },

  notAuthorizedForInit: {
    cs: `<uu5string/>
        <Uu5Elements.HighlightedBox colorScheme="negative">
          Aplikace běží, ale ještě nebyla inicializována a nemáte práva ji inicializovat.
        </Uu5Elements.HighlightedBox>`,
    en: `<uu5string/>
        <Uu5Elements.HighlightedBox colorScheme="negative">
          The application is running but it was not initialized yet and you do not have sufficient rights to do so.
        </Uu5Elements.HighlightedBox>`,
  },

  uuBtLocationUriLabel: {
    cs: "Umístění uuBusinessTerritory",
    en: "uuBusinessTerritory location",
  },

  uuBtLocationUriTooltip: {
    cs: "Uri uuBt umístění kam bude založen AWSC",
    en: "Uri of the uuBt location where AWSC will be created",
  },

  nameLabel: {
    cs: "Název",
    en: "Name",
  },

  initialize: {
    cs: "Inicializovat",
    en: "Initialize",
  },

  delete: {
    cs: "Smazat",
    en: "Delete",
  },

  retryInitialization: {
    cs: "Retry inicialization",
    en: "Retry Initialization",
  },

  rollbackInitialization: {
    cs: "Rollback inicialization",
    en: "Rollback Initialization",
  },

  openInitialize: {
    cs: "Otevřít inicializaci",
    en: "Open Initialization",
  },

  getInfo: {
    cs: "Podrobnější info",
    en: "Get Info",
  },

  rollbackWarning: {
    cs: "If you want to rollback running initialization (uuProgress is in some running state), set force to true.",
    en: "If you want to rollback running initialization (uuProgress is in some running state), set force to true.",
  },

  retryWarning: {
    cs: "If you want to restart (retry) running initialization (uuProgress is in some running state), set force to true.",
    en: "If you want to restart (retry) running initialization (uuProgress is in some running state), set force to true.",
  },

  cancel: {
    cs: "Zrušit",
    en: "Cancel",
  },

  close: {
    cs: "Zavřít",
    en: "Close",
  },

  wrongDtoInFormat: {
    cs: "Nesprávné DtoIn",
    en: "Wrong dtoIn",
  },

  wrongDtoInFormatMessage: {
    cs: "DtoIn JSON nemá správný formát.",
    en: "DtoIn JSON is not in proper format.",
  },

  wrongMode: {
    cs: "Pouze standard mode je podporován.",
    en: "Only standard mode is supported.",
  },

  wrongRetryMode: {
    cs: "Pouze retry mode je podporován.",
    en: "Only retry mode is supported.",
  },

  wrongRollbackMode: {
    cs: "Pouze rollback mode je podporován.",
    en: "Only rollback mode is supported.",
  },

  missingUuTerritoryBaseUri: {
    cs: "Není zadán parametr uuTerritoryBaseUri.",
    en: "uuTerritoryBaseUri is required in dtoIn.",
  },

  missingLocationId: {
    cs: "Není zadán parametr locationId.",
    en: "locationId is required in dtoIn.",
  },

  initCmdFailed: {
    cs: "Init uuCmd neproběhl.",
    en: "Init uuCmd failed.",
  },

  deleteCmdFailed: {
    cs: "Delete uuCmd neproběhl.",
    en: "Delete uuCmd failed.",
  },

  uuCmdSuccess: {
    cs: "Init uuCmd skončil",
    en: "Init uuCmd succeded",
  },

  uuCmdSuccessRollback: {
    cs: "Init uuCmd with rollabck mode skončil.",
    en: "Init uuCmd with rollabck mode succeded.",
  },

  uuCmdSuccessMessage: {
    cs: "Init will be started with page reload, the page will be reloaded in 3 seconds.",
    en: "Init will be started with page reload, the page will be reloaded in 3 seconds.",
  },

  uuCmdSuccessRollbackMessage: {
    cs: "Init will be rollback with page reload, the page will be reloaded in 3 seconds.",
    en: "Init will be rollback with page reload, the page will be reloaded in 3 seconds.",
  },

  uuCmdDeleteSuccess: {
    cs: "Delete uuCmd skončil",
    en: "Delete uuCmd succeded",
  },

  uuCmdDeleteSuccessMessage: {
    cs: "Delete uuCmd byl úspěšně ukončen, za 3s bude aplikace znovu načtena.",
    en: "Delete uuCmd successfully finished, page will be reloaded in 3 seconds.",
  },
};
