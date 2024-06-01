//@@viewOn:imports
import { createVisualComponent, Lsi, useLsiValues } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Uu5CodeKit from "uu5codekitg01";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import Config from "./config/config.js";
import LSI from "../routes/config/init-app-workspace-lsi";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  formControls: () =>
    Config.Css.css({
      textAlign: "right",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const AwcsInfo = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AwcsInfo",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data: systemWorkspaceData } = useSystemData();
    const { data: uuCookbook } = useSubAppData();
    const routeLsi = useLsiValues(LSI);

    function getItemList() {
      const itemList = [
        {
          icon: "mdi-close",
          children: <Lsi lsi={LSI.close} />,
          significance: "common",
          onClick: () => props.onClose(false),
        },
      ];
      if (props.setIsInitializeOpened) {
        itemList.push({
          icon: "mdi-play",
          children: routeLsi.openInitialize,
          significance: "common",
          onClick: () => {
            props.isInitializeOpened ? props.onClose(false) : props.setIsInitializeOpened(true);
          },
        });
      }
      return itemList;
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Uu5Elements.Modal
        header={
          <Uu5Elements.Text category="story" segment="heading" type="h2">
            <Lsi lsi={LSI.infoHeader} />
          </Uu5Elements.Text>
        }
        footer={<Uu5Elements.ActionGroup className={Css.formControls()} itemList={getItemList()} />}
        open={true}
        onClose={() => props.onClose(false)}
      >
        <Uu5CodeKit.Code
          value={JSON.stringify({ uuCookbook, systemWorkspaceData } || {}, null, 2)}
          codeStyle={"json"}
          showGutter={true}
        />
      </Uu5Elements.Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AwcsInfo };
export default AwcsInfo;
//@@viewOff:exports
