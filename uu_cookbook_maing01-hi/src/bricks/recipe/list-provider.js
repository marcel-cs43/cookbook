//@@viewOn:imports
import { createComponent, useDataList, useEffect, useRef } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const recipeDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        loadNext: handleLoadNext,
        create: handleCreate,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
        getImage: handleGetImage,
      },
      pageSize: 50,
    });

    const imageUrlListRef = useRef([]);

    function handleLoad(dtoIn) {
      return Calls.Recipe.list(dtoIn);
    }

    function handleLoadNext(dtoIn) {
      return Calls.Recipe.list(dtoIn);
    }

    function handleCreate(values) {
      return Calls.Recipe.create(values);
    }

    function handleUpdate(values) {
      return Calls.Recipe.update(values);
    }

    function handleDelete(recipe) {
      const dtoIn = { id: recipe.id };
      return Calls.Recipe.delete(dtoIn, props.baseUri);
    }

    async function handleGetImage(recipe) {
      const dtoIn = { code: recipe.image };
      const imageFile = await Calls.Recipe.getImage(dtoIn);
      const imageUrl = generateAndRegisterImageUrl(imageFile);
      return { ...recipe, imageFile, imageUrl };
    }

    function generateAndRegisterImageUrl(imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      imageUrlListRef.current.push(imageUrl);
      return imageUrl;
    }

    useEffect(() => {
      return () => imageUrlListRef.current.forEach((url) => URL.revokeObjectURL(url));
    }, []);
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(recipeDataList) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports
