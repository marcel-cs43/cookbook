import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/';
import ListView from '../../../src/bricks/recipe/list-view';
import Tile from '../../../src/bricks/recipe/tile';
import DetailModal from '../../../src/bricks/recipe/detail-modal';
import UpdateModal from '../../../src/bricks/recipe/update-modal';
import { useAlertBus } from 'uu5g05-elements';

jest.mock('uu5tilesg02-elements', () => ({
  Grid: jest.fn(({ children }) => <div>Mocked Grid{children}</div>)
}));

jest.mock('../../../src/bricks/recipe/tile', () => jest.fn(({ onDetail }) => <div onClick={onDetail}>Mocked Tile</div>));
jest.mock('../../../src/bricks/recipe/detail-modal', () => jest.fn(({ open }) => open ? <div>Mocked DetailModal</div> : null));
jest.mock('../../../src/bricks/recipe/update-modal', () => jest.fn(({ open }) => open ? <div>Mocked UpdateModal</div> : null));
jest.mock('uu5g05-elements', () => ({
  useAlertBus: jest.fn()
}));

describe('ListView component', () => {
  const mockAddAlert = jest.fn();
  const mockRecipeDataList = {
    data: [{ data: { id: '1', name: 'Recipe 1' }, handlerMap: { delete: jest.fn(), update: jest.fn() } }],
    handlerMap: {
      loadNext: jest.fn()
    },
    pageSize: 10
  };

  const defaultProps = {
    recipeDataList: mockRecipeDataList,
    categoryList: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAlertBus.mockReturnValue({ addAlert: mockAddAlert });
  });

  test('renders list view with tiles', () => {
    render(<ListView {...defaultProps} />);
    expect(screen.getByText('Mocked Tile')).toBeInTheDocument();
  });

  test('shows detail modal when detail is opened', () => {
    render(<ListView {...defaultProps} />);
    fireEvent.click(screen.getByText('Mocked Tile')); // Trigger onDetail
    expect(screen.getByText('Mocked DetailModal')).toBeInTheDocument();
  });

  test('calls onDelete and shows success alert on successful delete', async () => {
    const { handlerMap } = mockRecipeDataList.data[0];
    handlerMap.delete.mockResolvedValue();

    render(<ListView {...defaultProps} />);
    fireEvent.click(screen.getByText('Mocked Tile')); // Trigger onDetail
    fireEvent.click(screen.getByText('Mocked DetailModal')); // Assuming DetailModal triggers onDelete

    await waitFor(() => {
      expect(mockAddAlert).toHaveBeenCalledWith({
        message: 'Recipe "Recipe 1" deleted successfully.',
        priority: 'success',
        durationMs: 2000
      });
    });
    expect(handlerMap.delete).toHaveBeenCalled();
  });

  test('calls onUpdate and shows update modal', async () => {
    render(<ListView {...defaultProps} />);
    fireEvent.click(screen.getByText('Mocked Tile')); // Trigger onDetail
    fireEvent.click(screen.getByText('Mocked DetailModal')); // Assuming DetailModal triggers onUpdate
    expect(screen.getByText('Mocked UpdateModal')).toBeInTheDocument();
  });

  test('handles load next correctly', async () => {
    render(<ListView {...defaultProps} />);
    await fireEvent.scroll(window, { target: { scrollY: 1000 } }); // Simulate scroll to load more
    expect(mockRecipeDataList.handlerMap.loadNext).toHaveBeenCalled();
  });
});
