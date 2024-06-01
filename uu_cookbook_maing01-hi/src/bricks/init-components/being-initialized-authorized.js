//@@viewOn:imports
import { createVisualComponent, DynamicLibraryComponent, useState, useLsiValues, Lsi } from "uu5g05";
import { useSystemData, useSubAppData } from "uu_plus4u5g02";
import Uu5Elements from "uu5g05-elements";
import Config from "../../config/config.js";
import RetryForm from "./retry-form.js";
import RollbackForm from "./rollback-form.js";
import AwcsInfo from "../awsc-info.js";
import importLsi from "../../lsi/import-lsi.js";
import LSI from "../../routes/config/init-app-workspace-lsi";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: () =>
    Config.Css.css({
      marginTop: "64px",
      justifyContent: "center",
      alignItems: "center",
    }),
  fixedHeight: () =>
    Config.Css.css({
      height: "16px",
    }),
  topMargin: () =>
    Config.Css.css({
      marginTop: "64px",
      marginLeft: "128px",
      marginRight: "128px",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const BeingInitializedAuthorized = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "BeingInitializedAuthorized",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private

    const { data: uuCookbook } = useSubAppData();
    const { data: systemData } = useSystemData();
    const [isInfoOpened, setIsInfoOpened] = useState(false);
    const [isRetryOpened, setIsRetryOpened] = useState(false);
    const [isRollbackOpened, setIsRollbackOpened] = useState(false);
    const [rollbackDtoIn, setRollbackDtoIn] = useState(false);
    const [disableButtons, setDisableButtons] = useState(false);
    const [retryDtoIn, setRetryDtoIn] = useState(false);

    if (uuCookbook?.temporaryData?.dtoIn.mode) {
      uuCookbook.temporaryData.dtoIn.mode = "retry";
    }

    const [showConsole, setShowConsole] = useState(!!uuCookbook.consoleCode);
    const [retryInputData, setRetryInputData] = useState(
      JSON.stringify({ force: false, mode: "retry", data: uuCookbook?.temporaryData?.dtoIn }, null, 2),
    );
    const [rollbackInputData, setRollbackInputData] = useState(
      JSON.stringify({ force: true, mode: "rollback", data: {} }, null, 2),
    );
    const routeLsi = useLsiValues(LSI);
    const consoleBaseUri = uuCookbook.temporaryData.progressMap.uuConsoleUri;
    const progressCode = uuCookbook.temporaryData.progressMap.progressCode;
    const consoleCode = uuCookbook.temporaryData.progressMap.consoleCode;

    const proceedWithConsole = 3;
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <div className={Css.main()}>
        {isRetryOpened && (
          <RetryForm
            onClose={setIsRetryOpened}
            retryDtoIn={retryDtoIn}
            setRetryDtoIn={setRetryDtoIn}
            retryInputData={retryInputData}
            setRetryInputData={setRetryInputData}
            setDisableButtons={setDisableButtons}
            disableButtons={disableButtons}
          />
        )}
        {isRollbackOpened && (
          <RollbackForm
            onClose={setIsRollbackOpened}
            rollbackDtoIn={rollbackDtoIn}
            setRollbackDtoIn={setRollbackDtoIn}
            rollbackInputData={rollbackInputData}
            setRollbackInputData={setRollbackInputData}
            disableButtons={disableButtons}
            setDisableButtons={setDisableButtons}
          />
        )}
        {isInfoOpened && <AwcsInfo onClose={setIsInfoOpened} />}

        <Uu5Elements.PlaceholderBox
          code="folder"
          colorScheme="positive"
          header={<Lsi import={importLsi} path={["RetryInitForm", "beingInitializedHeader"]} />}
          info={routeLsi.beingInitializedAuthorizedInfo(systemData.awidData?.name || "uuAppWorkspace")}
          actionList={[
            {
              disabled: disableButtons,
              children: <Lsi import={importLsi} path={["InitAppWorkspace", "getInfo"]} />,
              icon: "mdi-information-variant",
              onClick: () => setIsInfoOpened(true),
            },
            {
              children: <Lsi import={importLsi} path={["InitAppWorkspace", "retryInitialization"]} />,
              icon: "mdi-play",
              colorScheme: "primary",
              disabled: disableButtons,
              onClick: () => setIsRetryOpened(true),
            },
            {
              children: <Lsi import={importLsi} path={["InitAppWorkspace", "rollback"]} />,
              icon: "mdi-play",
              colorScheme: "primary",
              disabled: disableButtons,
              onClick: () => setIsRollbackOpened(true),
            },
          ]}
          actionDirection={"horizontal"}
        />
        <div className={Css.topMargin()}>
          <DynamicLibraryComponent
            uu5Tag="UuConsole.Progress"
            baseUri={consoleBaseUri}
            progressCode={progressCode}
            interval={2}
            onDataReloaded={(data) => {
              if (data.doneWork >= proceedWithConsole && showConsole === false) {
                setShowConsole(true);
              }
              if (data.state === "completed") setTimeout(() => location.reload(), 2000);
            }}
          />
          {showConsole ? (
            <DynamicLibraryComponent
              interval={5}
              uu5Tag="UuConsole.Console"
              baseUri={consoleBaseUri}
              consoleCode={consoleCode}
            />
          ) : (
            <div className={Css.topMargin()}>
              <Uu5Elements.PlaceholderBox code="timer" info={routeLsi.waitForConsoleInfo} />
            </div>
          )}
        </div>
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { BeingInitializedAuthorized };
export default BeingInitializedAuthorized;
//@@viewOff:exports
