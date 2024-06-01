//@@viewOn:imports
import { createVisualComponent, useState, useLsiValues } from "uu5g05";
import { useSystemData } from "uu_plus4u5g02";
import Uu5Elements from "uu5g05-elements";
import Config from "../../config/config.js";
import InitForm from "./init-form.js";
import AwcsInfo from "../awsc-info.js";
import LSI from "../../routes/config/init-app-workspace-lsi";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: () =>
    Config.Css.css({
      minHeight: "70vh",
      maxWidth: "480px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 auto",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const InitAuthorized = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "InitAuthorized",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private

    const dtoInPattern = {
      mode: "standard",
      force: false,
      data: {
        uuTerritoryBaseUri: "Please enter baseURI of uuBusinessTerritory",
        locationId: "Please enter locationId in uuBusinessTerritory",
        name: "uuCookbookMaing01",
        desc: "uuCookbookMaing01",
      },
    };
    const { data: systemData } = useSystemData();

    const [inputData, setInputData] = useState(JSON.stringify(dtoInPattern, null, 2));
    const [isInfoOpened, setIsInfoOpened] = useState(false);
    const [isInitializeOpened, setIsInitializeOpened] = useState(false);
    const [initializeDtoIn, setInitializeDtoIn] = useState(false);
    const [isInitInProcess, setIsInitInProcess] = useState(false);
    const routeLsi = useLsiValues(LSI);
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <div className={Css.main()}>
        {isInitializeOpened && (
          <InitForm
            onClose={setIsInitializeOpened}
            initializeDtoIn={initializeDtoIn}
            setInitializeDtoIn={setInitializeDtoIn}
            isInfoOpened={isInfoOpened}
            setIsInfoOpened={setIsInfoOpened}
            inputData={inputData}
            setInputData={setInputData}
            setIsInitInProcess={setIsInitInProcess}
          />
        )}
        {isInfoOpened && (
          <AwcsInfo
            onClose={setIsInfoOpened}
            isInitializeOpened={isInitializeOpened}
            setIsInitializeOpened={setIsInitializeOpened}
          />
        )}
        <Uu5Elements.PlaceholderBox
          code="product"
          colorScheme="positive"
          header={routeLsi.notInitializedHeader}
          info={routeLsi.authorizedInfo(systemData.awidData?.name || "uuAppWorkspace")}
          actionList={[
            {
              children: routeLsi.getInfo,
              disabled: isInitInProcess,
              icon: "mdi-information-variant",
              onClick: () => setIsInfoOpened(true),
            },
            {
              disabled: isInitInProcess,
              children: routeLsi.initialize,
              icon: "mdi-play",
              colorScheme: "primary",
              onClick: () => setIsInitializeOpened(true),
            },
          ]}
          actionDirection={"horizontal"}
        />
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { InitAuthorized };
export default InitAuthorized;
//@@viewOff:exports
