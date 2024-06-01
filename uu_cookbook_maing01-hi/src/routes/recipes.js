//@@viewOn:imports
import { createVisualComponent, useScreenSize } from "uu5g05";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import { RouteController } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import ListProvider from "../bricks/recipe/list-provider";
import ListTitle from "../bricks/recipe/list-title";
import ListView from "../bricks/recipe/list-view";
import CreateView from "../bricks/recipe/create-view";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: (screenSize) => {
    let maxWidth;

    switch (screenSize) {
      case "xs":
      case "s":
        maxWidth = "100%";
        break;
      case "m":
      case "l":
        maxWidth = 640;
        break;
      case "xl":
      default:
        maxWidth = 1280;
    }

    return Config.Css.css({ maxWidth: maxWidth, margin: "0px auto", paddingLeft: 8, paddingRight: 8 });
  },
  createView: () => Config.Css.css({ margin: "24px 0px" }),
};
//@@viewOff:css

let Recipes = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Recipes",
  //@@viewOff:statics

  render() {
    //@@viewOn:private
    const subAppDataObject = useSubAppData();
    const systemDataObject = useSystemData();
    const [screenSize] = useScreenSize();

    const categoryList = subAppDataObject.data?.categoryList || [];

    //@@viewOff:private

    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <ListProvider>
          {(recipeDataList) => (
            <RouteController routeDataObject={recipeDataList}>
              <div className={Css.container(screenSize)}>
                <CreateView
                  recipeDataList={recipeDataList}
                  categoryList={categoryList}
                  className={Css.createView()}
                />
                <ListView
                  recipeDataList={recipeDataList}
                  categoryList={categoryList}
                />
                <ListTitle recipeList={recipeDataList.data} />
              </div>
            </RouteController>
          )}
        </ListProvider>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Recipes };
export default Recipes;
//@@viewOff:exports
