//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes } from "uu5g05";
import { Modal, Box, Line, Text, DateTime } from "uu5g05-elements";
import { PersonPhoto } from "uu_plus4u5g02-elements";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  content: () =>
    Config.Css.css({
      marginTop: -16,
      marginLeft: -24,
      marginRight: -24,
      marginBottom: -16,
    }),

  image: () =>
    Config.Css.css({
      display: "block",
      maxWidth: "100%",
      margin: "auto",
    }),

  text: () =>
    Config.Css.css({
      display: "block",
      marginLeft: 24,
      marginRight: 24,
      
      marginBottom: 16,
    }),

  infoLine: () =>
    Config.Css.css({
      display: "block",
      marginLeft: 24,
      marginTop: 8,
    }),

  footer: () =>
    Config.Css.css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      marginTop: 8,
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 24,
      paddingRight: 24,
    }),

  photo: () =>
    Config.Css.css({
      marginRight: 8,
    }),
};
//@@viewOff:css

//@@viewOn:helpers
function InfoLine({ children }) {
  return (
    <Text
      category="interface"
      segment="content"
      type="medium"
      significance="subdued"
      colorScheme="building"
      className={Css.infoLine()}
    >
      {children}
    </Text>
  );
}

function buildCategoryNames(categoryIdList, categoryList) {
  let categoryIds = new Set(categoryIdList);
  return categoryList
    .reduce((acc, category) => {
      if (categoryIds.has(category.id)) {
        acc.push(category.name);
      }
      return acc;
    }, [])
    .join(", ");
}
//@@viewOff:helpers

const DetailModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DetailModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    recipeDataObject: PropTypes.object.isRequired,
    categoryList: PropTypes.array,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    function getActions() {
      const isActionDisabled = props.recipeDataObject.state === "pending";
      const canManage = true;
      let actionList = [];

      if (canManage) {
        actionList.push({
          icon: "mdi-pencil",
          children: "Update",
          onClick: () => props.onUpdate(props.recipeDataObject),
          disabled: isActionDisabled,
          primary: true,
        });

        actionList.push({
          icon: "mdi-delete",
          children: "Delete",
          onClick: () => props.onDelete(props.recipeDataObject),
          disabled: isActionDisabled,
          collapsed: true,
        });
      }

      return actionList;
    }
    //@@viewOff:private

    //@@viewOn:render
    const recipe = props.recipeDataObject.data;

    return (
      <Modal header={recipe.name} onClose={props.onClose} actionList={getActions()} open>
        <div className={Css.content()}>
          {recipe.text && (
            <Text category="interface" segment="content" type="medium" colorScheme="building" className={Css.text()}>
              {recipe.text}
            </Text>
          )}

          {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.name} className={Css.image()} />}

          <Line significance="subdued" />

          {recipe.categoryIdList?.length > 0 && (
            <InfoLine>{buildCategoryNames(recipe.categoryIdList, props.categoryList)}</InfoLine>
          )}

          <InfoLine>
            <DateTime value={recipe.sys.cts} dateFormat="short" timeFormat="none" />
          </InfoLine>

          <InfoLine>{Utils.String.format("Rating: {0}", recipe.ratingCount)}</InfoLine>

          <Box significance="distinct" className={Css.footer()}>
            <span>
              <PersonPhoto uuIdentity={recipe.uuIdentity} size="xs" className={Css.photo()} />
              <Text category="interface" segment="content" colorScheme="building" type="medium">
                {recipe.uuIdentityName}
              </Text>
            </span>
            <span>{Utils.String.format("Average Rating: {0}", recipe.averageRating.toFixed(1))}</span>
          </Box>
        </div>
      </Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DetailModal };
export default DetailModal;
//@@viewOff:exports
