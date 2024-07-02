//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { Box, Text, Line, Button } from "uu5g05-elements";
import Config from "./config/config.js";
//@@viewOff:imports

const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  render() {
    //@@viewOn:private
    function handleDelete() {
      alert("I can't delete joke. I'm dumb visual component.");
    }

    function handleUpdate() {
      alert("I can't update joke. I'm dumb visual component.");
    }
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Box style={{ width: 640, margin: "24px auto" }}>
        <Text category="interface" segment="title" type="minor" colorScheme="building">
          New Years&apos; resolution
        </Text>
        <div>
          <Text category="interface" segment="content" type="medium" colorScheme="building">
            My New Years&apos; resolution is 8K.
          </Text>
        </div>
        <div>
          <img src="https://picsum.photos/id/164/640/320" />
        </div>
        <Line significance="subdued" />
        <div>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            IT, sport, hardware
          </Text>
        </div>
        <div>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            Jan Novák
          </Text>
        </div>
        <div>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            17.03.2022
          </Text>
        </div>
        <Box significance="distinct">
          Average rating: 3 / 5
          <Button icon="mdi-pencil" onClick={handleUpdate} significance="subdued" tooltip="Update" />
          <Button icon="mdi-delete" onClick={handleDelete} significance="subdued" tooltip="Delete" />
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