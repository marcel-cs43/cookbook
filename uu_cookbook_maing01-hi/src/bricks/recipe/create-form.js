import { createVisualComponent, PropTypes, Utils } from "uu5g05";
import { Form, FormText, FormSelect, FormFile, FormTextArea, SubmitButton, CancelButton } from "uu5g05-forms";
import Config from "./config/config.js";

//@@viewOn:css
const Css = {
  input: () => Config.Css.css({ marginBottom: 16 }),
  controls: () => Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" }),
};
//@@viewOff:css

//@@viewOn:helpers
function getCategoryItemList(categoryList) {
  return categoryList.map((category) => {
    return { value: category.id, children: category.name };
  });
}
//@@viewOff:helpers

const CreateForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    categoryList: PropTypes.array,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
    onSubmit: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private

    function handleValidate(event) {
      const { text, image } = event.data.value;

      if (!text && !image) {
        return {
          message: "Please provide either text or image.",
        };
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    return (
      <Form {...elementProps} onSubmit={props.onSubmit} onValidate={handleValidate}>
        <FormText label="Name" name="name" maxLength={255} className={Css.input()} required autoFocus />

        <FormSelect
          label="Category"
          name="categoryIdList"
          itemList={getCategoryItemList(props.categoryList)}
          className={Css.input()}
          multiple
        />

        <FormFile label="Image" name="image" accept="image/*" className={Css.input()} />

        <FormTextArea label="Text" name="text" maxLength={4000} rows={10} className={Css.input()} autoResize />

        <div className={Css.controls()}>
          <CancelButton onClick={props.onCancel}>Cancel</CancelButton>
          <SubmitButton>Submit</SubmitButton>
        </div>
      </Form>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateForm };
export default CreateForm;
//@@viewOff:exports
