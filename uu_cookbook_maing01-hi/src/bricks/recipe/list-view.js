//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useState } from "uu5g05";
import { useAlertBus } from "uu5g05-elements";
import { Grid } from "uu5tilesg02-elements";
import Tile from "./tile";
import Config from "./config/config.js";
import DetailModal from "./detail-modal";
import UpdateModal from "./update-modal";
//@@viewOff:imports

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
function getRecipeDataObject(recipeDataList, id) {
  const item =
  recipeDataList.newData?.find((item) => item?.data.id === id) ||
  recipeDataList.data.find((item) => item?.data.id === id);

  return item;
}
//@@viewOff:helpers
const ListView = createVisualComponent({
  uu5Tag: Config.TAG + "ListView",

  propTypes: {
    recipeDataList: PropTypes.object.isRequired,
    categoryList: PropTypes.array,
  },

  defaultProps: {
    categoryList: [],
  },

  render(props) {
    const { addAlert } = useAlertBus();
    const [detailData, setDetailData] = useState({ open: false, id: undefined });
    const [updateData, setUpdateData] = useState({ open: false, id: undefined });

    const activeDataObjectId = detailData.id || updateData.id;
    let activeDataObject;

    if (activeDataObjectId) {
      activeDataObject = getRecipeDataObject(props.recipeDataList, activeDataObjectId);
    }

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    async function handleDelete(recipeDataObject) {
      try {
        await recipeDataObject.handlerMap.delete();
      } catch (error) {
        showError(error, "Delete failed");
        return;
      }

      addAlert({
        message: `Recipe "${recipeDataObject.data.name}" deleted successfully.`,
        priority: "success",
        durationMs: 2000,
      });
    }

    async function handleUpdate(recipeDataObject) {
      setUpdateData({ open: true, id: recipeDataObject.data.id });
    }

    async function handleUpdateSubmit(recipeDataObject, values) {
      try {
        await recipeDataObject.handlerMap.update(values);
      } catch (error) {
        showError(error, "Update failed");
        return;
      }

      setUpdateData({ open: false });
    }

    function handleUpdateCancel() {
      setUpdateData({ open: false });
    }

    async function handleLoadNext({ indexFrom }) {
      try {
        await props.recipeDataList.handlerMap.loadNext({
          pageInfo: {
            pageIndex: Math.floor(indexFrom / props.recipeDataList.pageSize),
          },
        });
      } catch (error) {
        showError(error, "Page load failed");
      }
    }

    const handleItemDetailOpen = (recipeDataObject) => setDetailData({ open: true, id: recipeDataObject.data.id });
    const handleItemDetailClose = () => setDetailData({ open: false });

    const tileProps = {
      categoryList: props.categoryList,
      onDetail: handleItemDetailOpen,
      onDelete: handleDelete,
      onUpdate: handleUpdate,
    };

    return (
      <div>
        <Grid
          data={props.recipeDataList.data}
          onLoad={handleLoadNext}
          verticalGap={8}
          horizontalGap={8}
          tileHeight={300}
          tileMinWidth={400}
          tileMaxWidth={800}
          emptyState="No recipes available."
        >
          <Tile {...tileProps} />
        </Grid>
        {detailData.open && activeDataObject && (
          <DetailModal
            recipeDataObject={activeDataObject}
            categoryList={props.categoryList}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onClose={handleItemDetailClose}
            open
          />
        )}
        {updateData.open && (
          <UpdateModal
            recipeDataObject={activeDataObject}
            categoryList={props.categoryList}
            onSubmit={handleUpdateSubmit}
            onCancel={handleUpdateCancel}
            open
          />
        )}
      </div>
    );
  },
});

export { ListView };
export default ListView;
