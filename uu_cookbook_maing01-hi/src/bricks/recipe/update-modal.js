import { createVisualComponent, PropTypes, Utils } from "uu5g05";
import { Modal } from "uu5g05-elements";
import { Form, FormText, FormTextArea, FormSelect, FormFile, SubmitButton, CancelButton } from "uu5g05-forms";
import Config from "./config/config";
import { useAlertBus } from "uu5g05-elements";

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

export const UpdateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    recipeDataObject: PropTypes.object.isRequired,
    categoryList: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    async function handleSubmit(event) {
      const values = { ...event.data.value };

      if (props.recipeDataObject?.data.image && !values.image) {
        delete values.image;
        values.deleteImage = true;
      }

      const result = await props.onSubmit(props.recipeDataObject, values);

      addAlert({
        message: Utils.String.format("Recipe updated: {0}", values.name),
        priority: "success",
        durationMs: 2000,
      });

      return result;
    }
  
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
    if (!props.recipeDataObject) {
      return null;
    }
  
    const recipe = props.recipeDataObject.data;

    const formControls = (
      <div className={Css.controls()}>
        <CancelButton onClick={props.onCancel}>Cancel</CancelButton>
        <SubmitButton>Submit</SubmitButton>
      </div>
    );

    return (
      <Form.Provider onSubmit={handleSubmit} onValidate={handleValidate}>
        <Modal header="Update Recipe" footer={formControls} open>
          <Form.View>
            <FormText
              label="Name"
              name="name"
              initialValue={recipe.name}
              maxLength={255}
              className={Css.input()}
              required
              autoFocus
            />

            <FormSelect
              label="Category"
              name="categoryIdList"
              initialValue={recipe.categoryIdList}
              itemList={getCategoryItemList(props.categoryList)}
              className={Css.input()}
              multiple
            />

            <FormFile
              label="Image"
              name="image"
              initialValue={recipe.imageFile}
              accept="image/*"
              className={Css.input()}
            />

            <FormTextArea
              label="Text"
              name="text"
              initialValue={recipe.text}
              maxLength={4000}
              rows={10}
              className={Css.input()}
              autoResize
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

export default UpdateModal;
