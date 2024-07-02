// CreateView.test.js
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateView from '../../../src/bricks/recipe/create-view';

jest.mock('../../../src/bricks/recipe/create-form', () => (props) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit({ data: { value: { name: 'Test Recipe', text: 'This is a test recipe.' } } });
      }}
      onReset={props.onCancel}
    >
      <button type="submit">Submit Form</button>
      <button type="reset">Cancel Form</button>
    </form>
  );
});
const mockAddAlert = jest.fn();
jest.mock('uu5g05-elements', () => ({
  ...jest.requireActual('uu5g05-elements'),
  useAlertBus: () => ({
    addAlert: mockAddAlert,
  }),
}));
describe('CreateView Component', () => {
  const defaultProps = {
    categoryList: [],
    recipeDataList: {
      handlerMap: {
        create: jest.fn(),
        load: jest.fn(),
      },
    },
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('renders with create button initially', () => {
    const { getByText } = render(<CreateView {...defaultProps} />);
    expect(getByText('Create Recipe')).toBeInTheDocument();
  });
  test('switches to form mode when button is clicked', () => {
    const { getByText } = render(<CreateView {...defaultProps} />);
    fireEvent.click(getByText('Create Recipe'));
    expect(getByText('Submit Form')).toBeInTheDocument();
    expect(getByText('Cancel Form')).toBeInTheDocument();
  });
  test('calls onSubmit and shows success alert on form submission', async () => {
    const recipe = { name: 'Test Recipe' };
    defaultProps.recipeDataList.handlerMap.create.mockResolvedValue(recipe);
    const { getByText } = render(<CreateView {...defaultProps} />);
    fireEvent.click(getByText('Create Recipe'));
    fireEvent.submit(getByText('Submit Form'));
    await waitFor(() => {
      expect(mockAddAlert).toHaveBeenCalledWith({
        message: 'Recipe created: Test Recipe',
        priority: 'success',
        durationMs: 2000,
      });
    });
    expect(defaultProps.recipeDataList.handlerMap.load).toHaveBeenCalled();
    expect(getByText('Create Recipe')).toBeInTheDocument();
  });
  test('calls onSubmit and shows error alert on form submission failure', async () => {
    const error = new Error('Creation Failed');
    defaultProps.recipeDataList.handlerMap.create.mockRejectedValue(error);
    const { getByText } = render(<CreateView {...defaultProps} />);
    fireEvent.click(getByText('Create Recipe'));
    fireEvent.submit(getByText('Submit Form'));
    await waitFor(() => {
      expect(mockAddAlert).toHaveBeenCalledWith({
        header: 'Creation Failed',
        message: 'Creation Failed',
        priority: 'error',
      });
    });
    expect(getByText('Submit Form')).toBeInTheDocument();
    expect(getByText('Cancel Form')).toBeInTheDocument();
  });
  test('switches back to button mode on cancel', () => {
    const { getByText } = render(<CreateView {...defaultProps} />);
    fireEvent.click(getByText('Create Recipe'));
    fireEvent.reset(getByText('Cancel Form'));
    expect(getByText('Create Recipe')).toBeInTheDocument();
  });
});
