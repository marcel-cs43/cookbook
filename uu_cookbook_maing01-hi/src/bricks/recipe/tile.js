import { createVisualComponent, PropTypes, Utils, useEffect, useUserPreferences } from "uu5g05";
import { Box, Text, Button, Pending } from "uu5g05-elements";
import Config from "./config/config.js";

//@@viewOn:css
const Css = {
  main: () =>
    Config.Css.css({
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }),

  header: () =>
    Config.Css.css({
      display: "block",
      padding: 16,
      height: 48,
    }),

  content: (image) =>
    Config.Css.css({
      display: "flex",
      alignItems: image ? "center" : "left",
      justifyContent: image ? "center" : "flex-start",
      height: "calc(100% - 48px - 48px)",
      overflow: "hidden",
    }),

  text: () =>
    Config.Css.css({
      display: "block",
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 16,
    }),

  image: () => Config.Css.css({ width: "100%" }),

  footer: () =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 48,
      paddingLeft: 16,
      paddingRight: 8,
    }),
};
//@@viewOff:css

const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    categoryList: PropTypes.array,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    data: PropTypes.object,
    onDetail: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [preferences] = useUserPreferences();
    const recipeDataObject = props.data;

    useEffect(() => {
      if (
        recipeDataObject.data.image &&
        !recipeDataObject.data.imageUrl &&
        recipeDataObject.state === "ready" &&
        recipeDataObject.handlerMap?.getImage
      ) {
        recipeDataObject.handlerMap
          .getImage(recipeDataObject.data)
          .catch((error) => Tile.logger.error("Error loading image", error));
      }
    }, [recipeDataObject]);

    function handleDelete(event) {
      event.stopPropagation();
      props.onDelete(recipeDataObject);
    }

    function handleUpdate(event) {
      event.stopPropagation();
      props.onUpdate(recipeDataObject);
    }

    function handleDetail() {
      props.onDetail(recipeDataObject);
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props, Css.main());
    const recipe = recipeDataObject.data;
    // Allow all users to manage recipes
    const canManage = true;
    const isActionDisabled = recipeDataObject.state === "pending";

    return (
      <Box {...elementProps} onClick={handleDetail}>
        <Text category="interface" segment="title" type="minor" colorScheme="building" className={Css.header()}>
          {recipe.name}
        </Text>

        <div className={Css.content(recipe.image)}>
          {recipe.text && !recipe.image && (
            <Text category="interface" segment="content" type="medium" colorScheme="building" className={Css.text()}>
              {recipe.text}
            </Text>
          )}
          {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.name} className={Css.image()} />}
          {recipe.image && !recipe.imageUrl && <Pending size="xl" />}
        </div>

        <Box significance="distinct" className={Css.footer()}>
          {Utils.String.format(
            "Average Rating: {0}",
            Utils.Number.format(recipe.averageRating.toFixed(recipe.averageRating % 1 ? 1 : 0), {
              groupingSeparator: preferences.numberGroupingSeparator,
              decimalSeparator: preferences.numberDecimalSeparator,
            })
          )}
          {canManage && (
            <div>
              <Button
                icon="mdi-pencil"
                onClick={handleUpdate}
                significance="subdued"
                tooltip="Update"
                disabled={isActionDisabled}
              />
              <Button
                icon="mdi-delete"
                onClick={handleDelete}
                significance="subdued"
                tooltip="Delete"
                disabled={isActionDisabled}
              />
            </div>
          )}
        </Box>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Tile };
export default Tile;
//@@viewOff:exports
