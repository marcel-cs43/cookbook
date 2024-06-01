//@@viewOn:imports
import { createVisualComponent, useLsiValues } from "uu5g05";
import Config from "../../config/config.js";
import Uu5Elements from "uu5g05-elements";
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

const NotAuthorized = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "NotAuthorized",
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
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <div className={Css.main()}>
        <Uu5Elements.PlaceholderBox
          code="permission"
          colorScheme="negative"
          header={routeLsi.notInitializedHeader}
          info={routeLsi.notAuthorizedInfo}
        />
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { NotAuthorized };
export default NotAuthorized;
//@@viewOff:exports
