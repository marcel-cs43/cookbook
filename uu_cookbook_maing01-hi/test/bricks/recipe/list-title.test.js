import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListTitle from '../../../src/bricks/recipe/list-title';

describe('ListTitle Component', () => {
  const originalTitle = document.title;
  afterEach(() => {
    document.title = originalTitle;
  });
  test('sets the document title based on the number of recipes', () => {
    const recipeList = [{ id: 1, name: 'Recipe 1' }, { id: 2, name: 'Recipe 2' }];
    render(<ListTitle recipeList={recipeList} />);
    expect(document.title).toBe(`${originalTitle}- 2 recipes`);
  });
  test('updates the document title when recipeList length changes', () => {
    const { rerender } = render(<ListTitle recipeList={[{ id: 1, name: 'Recipe 1' }]} />);
    expect(document.title).toBe(`${originalTitle}- 1 recipes`);
    rerender(<ListTitle recipeList={[{ id: 1, name: 'Recipe 1' }, { id: 2, name: 'Recipe 2' }]} />);
    expect(document.title).toBe(`${originalTitle}- 2 recipes`);
  });
  test('cleans up by resetting the document title on unmount', () => {
    const { unmount } = render(<ListTitle recipeList={[{ id: 1, name: 'Recipe 1' }]} />);
    unmount();
    expect(document.title).toBe(originalTitle);
  });
});
