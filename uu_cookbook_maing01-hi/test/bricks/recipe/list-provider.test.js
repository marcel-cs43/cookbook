import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDataList } from 'uu5g05';
import ListProvider from '../../../src/bricks/recipe/list-provider';
import Calls from 'calls';

jest.mock('calls', () => ({
  Recipe: {
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getImage: jest.fn(),
  },
}));
jest.mock('uu5g05', () => ({
  ...jest.requireActual('uu5g05'),
  useDataList: jest.fn(),
}));
describe('ListProvider Component', () => {
  const mockRecipeList = [
    { id: 1, name: 'Recipe 1', image: 'image1' },
    { id: 2, name: 'Recipe 2', image: 'image2' },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('initializes data list with correct handler maps', () => {
    useDataList.mockReturnValue({
      data: mockRecipeList,
      state: 'ready',
    });
    Calls.Recipe.list.mockResolvedValue({ itemList: mockRecipeList });
    const { getByText } = render(
      <ListProvider>
        {(recipeDataList) => {
          return recipeDataList.data.map((recipe) => <div key={recipe.id}>{recipe.name}</div>);
        }}
      </ListProvider>
    );
    expect(useDataList).toHaveBeenCalledWith(expect.objectContaining({
      handlerMap: {
        load: expect.any(Function),
        loadNext: expect.any(Function),
        create: expect.any(Function),
      },
      itemHandlerMap: {
        update: expect.any(Function),
        delete: expect.any(Function),
        getImage: expect.any(Function),
      },
      pageSize: 50,
    }));

    mockRecipeList.forEach(recipe => {
      expect(getByText(recipe.name)).toBeInTheDocument();
    });
  });

  test('handleLoad function works correctly', async () => {
    Calls.Recipe.list.mockResolvedValue({ itemList: mockRecipeList });

    let handlerMap;
    useDataList.mockImplementation((config) => {
      handlerMap = config.handlerMap;
      return {
        data: [],
        state: 'ready',
      };
    });
    render(<ListProvider>{() => null}</ListProvider>);
    const response = await handlerMap.load();
    expect(Calls.Recipe.list).toHaveBeenCalled();
    expect(response.itemList).toEqual(mockRecipeList);
  });
  test('handleCreate function works correctly', async () => {
    const newRecipe = { id: 3, name: 'Recipe 3' };
    Calls.Recipe.create.mockResolvedValue(newRecipe);
    let handlerMap;
    useDataList.mockImplementation((config) => {
      handlerMap = config.handlerMap;
      return {
        data: [],
        state: 'ready',
      };
    });
    render(<ListProvider>{() => null}</ListProvider>);
    const response = await handlerMap.create(newRecipe);
    expect(Calls.Recipe.create).toHaveBeenCalledWith(newRecipe);
    expect(response).toEqual(newRecipe);
  });
  test('handleUpdate function works correctly', async () => {
    const updatedRecipe = { id: 1, name: 'Updated Recipe 1' };
    Calls.Recipe.update.mockResolvedValue(updatedRecipe);
    let itemHandlerMap;
    useDataList.mockImplementation((config) => {
      itemHandlerMap = config.itemHandlerMap;
      return {
        data: [],
        state: 'ready',
      };
    });
    render(<ListProvider>{() => null}</ListProvider>);
    const response = await itemHandlerMap.update(updatedRecipe);
    expect(Calls.Recipe.update).toHaveBeenCalledWith(updatedRecipe);
    expect(response).toEqual(updatedRecipe);
  });
  test('handleDelete function works correctly', async () => {
    Calls.Recipe.delete.mockResolvedValue();
    let itemHandlerMap;
    useDataList.mockImplementation((config) => {
      itemHandlerMap = config.itemHandlerMap;
      return {
        data: [],
        state: 'ready',
      };
    });
    render(<ListProvider>{() => null}</ListProvider>);
    const recipe = { id: 1, name: 'Recipe 1' };
    await itemHandlerMap.delete(recipe);
    expect(Calls.Recipe.delete).toHaveBeenCalledWith({ id: recipe.id }, undefined);
  });
});
