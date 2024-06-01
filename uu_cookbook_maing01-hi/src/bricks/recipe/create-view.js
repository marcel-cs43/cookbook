import { createVisualComponent, PropTypes, Utils, useState } from "uu5g05";
import { Button, useAlertBus } from "uu5g05-elements";
import CreateForm from "./create-form.js";
import Config from "./config/config.js";

//@@viewOn:css
const Css = {
  button: () => Config.Css.css({ display: "block", margin: "0px auto" }),
};
//@@viewOff:css

//@@viewOn:constants
const Mode = {
  BUTTON: "BUTTON",
  FORM: "FORM",
};
//@@viewOff:constants

//@@viewOn:helpers
function CreateButton(props) {
  return (
    <Button {...props} colorScheme="primary" significance="highlighted" className={Css.button()}>
      {props.children}
    </Button>
  );
}
//@@viewOff:helpers

const CreateView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    categoryList: PropTypes.array,
    onCreate: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [mode, setMode] = useState(Mode.BUTTON);
    const { addAlert } = useAlertBus();

    async function handleSubmit(event) {
      let recipe;

      try {
        recipe = await props.recipeDataList.handlerMap.create(event.data.value);
      } catch (error) {
        CreateView.logger.error("Error while creating recipe", error);
        addAlert({
          header: "Creation Failed",
          message: error.message,
          priority: "error",
        });
        return;
      }

      addAlert({
        message: Utils.String.format("Recipe created: {0}", recipe.name),
        priority: "success",
        durationMs: 2000,
      });

      setMode(Mode.BUTTON);

      props.recipeDataList.handlerMap.load();
    }
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    let content;

    switch (mode) {
      case Mode.BUTTON:
        content = <CreateButton onClick={() => setMode(Mode.FORM)}>Create Recipe</CreateButton>;
        break;
      default:
        content = (
          <CreateForm onSubmit={handleSubmit} onCancel={() => setMode(Mode.BUTTON)} categoryList={props.categoryList} />
        );
        break;
    }

    return <div {...attrs}>{content}</div>;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateView };
export default CreateView;
//@@viewOff:exports
