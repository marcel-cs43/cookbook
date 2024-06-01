//@@viewOn:imports
import { createVisualComponent, Lsi, useCall, useLsiValues, useState } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Uu5CodeKit from "uu5codekitg01";
import Config from "../config/config.js";
import Calls from "calls";
import LSI from "../../routes/config/init-app-workspace-lsi";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  input: () => Config.Css.css({ marginTop: 16 }),
  formControls: () =>
    Config.Css.css({
      textAlign: "right",
    }),
  data: () =>
    Config.Css.css({
      maxWidth: 1024,
      margin: "auto",
    }),
  noBottomMargin: () =>
    Config.Css.css({
      marginBottom: "0px!important",
    }),
};
//@@viewOff:css

const RollbackForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "RollbackForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const routeLsi = useLsiValues(LSI);
    const { addAlert } = Uu5Elements.useAlertBus();
    const [rollbackInProgress, setRollbackInProgress] = useState(false);
    const { state: initializeState, call: rollbackCall } = useCall(initialize);
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Uu5Elements.Modal
        header={
          <Uu5Elements.Text category="story" segment="heading" type="h2">
            <Lsi lsi={LSI.rollbackInitialization} />
          </Uu5Elements.Text>
        }
        footer={
          <Uu5Elements.ActionGroup
            className={Css.formControls()}
            itemList={[
              {
                icon: "mdi-close",
                children: routeLsi.close,
                significance: "common",
                disabled: initializeState.includes("pending"),
                onClick: () => props.onClose(false),
              },
              {
                icon: "mdi-play",
                children: routeLsi.rollbackInitialization,
                colorScheme: "primary",
                significance: "highlighted",
                disabled: rollbackInProgress || initializeState.includes("pending"),
                onClick: () => rollbackCall(props, addAlert, routeLsi, setRollbackInProgress),
              },
            ]}
          />
        }
        actionList={initializeState.includes("pending") ? [{ icon: "mdi-loading mdi-spin" }] : undefined}
        info={<Lsi lsi={LSI.formHeaderInfo} />}
        open={true}
        onClose={() => props.onClose(false)}
      >
        {/*<Uu5Elements.HighlightedBox colorScheme="warning">{routeLsi.rollbackWarning}</Uu5Elements.HighlightedBox>*/}
        <Uu5CodeKit.Json
          className={Css.noBottomMargin()}
          spacing={0}
          name="dtoIn"
          format="pretty"
          rows={15}
          controlled={true}
          value={props.rollbackInputData}
          disabled={initializeState.includes("pending")}
          onBlur={(e) => props.setRollbackInputData(e.data.value)}
        />
      </Uu5Elements.Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers

async function initialize(props, addAlert, routeLsi, setRollbackInProgress) {
  let dtoIn = JSON.parse(props.rollbackInputData);
  if (dtoIn.mode !== "rollback") {
    addAlert({
      header: routeLsi.wrongDtoInFormat,
      message: routeLsi.wrongRollbackMode,
      priority: "error",
      durationMs: 3000,
    });
    return;
  }

  let workspace;
  try {
    props.setDisableButtons(true);
    setRollbackInProgress(true);
    workspace = await Calls.initWorkspace(dtoIn);
    addAlert({
      header: routeLsi.uuCmdSuccessRollback,
      message: routeLsi.uuCmdSuccessRollbackMessage,
      priority: "success",
      durationMs: 3000,
    });
    setTimeout(() => location.reload(), 3000);
  } catch (e) {
    addAlert({ header: routeLsi.initCmdFailed, message: e.message, priority: "error" });
    props.setDisableButtons(false);
    setRollbackInProgress(false);
  }

  return workspace;
}
//@@viewOff:helpers

//@@viewOn:exports
export { RollbackForm };
export default RollbackForm;
//@@viewOff:exports
