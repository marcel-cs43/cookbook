import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Tile from "../../../src/bricks/recipe/tile.js";

describe("Tile component", () => {
  const mockData = {
    data: {
      name: "Test Recipe",
      text: "This is a test recipe.",
      averageRating: 4.5,
      imageUrl: "http://example.com/image.jpg",
      image: true,
    },
    state: "ready",
    handlerMap: {
      getImage: jest.fn(),
    },
  };

  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockDetail = jest.fn();

  function renderTile(props = {}) {
    return render(
      <Tile
        data={mockData}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
        onDetail={mockDetail}
        {...props}
      />
    );
  }

  test("renders Tile with basic content", () => {
    const { getByText } = renderTile();
    expect(getByText("Test Recipe")).toBeInTheDocument();
  });
  test("handles detail click", () => {
    const { getByText } = renderTile();
    fireEvent.click(getByText("Test Recipe"));
    expect(mockDetail).toHaveBeenCalledWith(mockData);
  });
  test("handles update click", () => {
    const { container } = renderTile();
    const updateButton = container.querySelector('[data-testid="icon"].mdi-pencil');
    fireEvent.click(updateButton);
    expect(mockUpdate).toHaveBeenCalledWith(mockData);
  });
  test("handles delete click", () => {
    const { container } = renderTile();
    const deleteButton = container.querySelector('[data-testid="icon"].mdi-delete');
    fireEvent.click(deleteButton);
    expect(mockDelete).toHaveBeenCalledWith(mockData);
  });
});
