import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdateModal from '../../../src/bricks/recipe/update-modal';
import { useAlertBus } from "uu5g05-elements";

jest.mock("uu5g05-forms", () => ({
  ...jest.requireActual("uu5g05-forms"),
  Form: ({ children, onSubmit, onValidate }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ data: { value: {} } });
      }}
      onValidate={(e) => {
        e.preventDefault();
        onValidate({ data: { value: {} } });
      }}
    >
      {children}
    </form>
  ),
  FormText: (props) => <input {...props} />,
  FormTextArea: (props) => <textarea {...props} />,
  FormSelect: (props) => <select {...props} />,
  FormFile: (props) => <input type="file" {...props} />,
  SubmitButton: (props) => <button {...props} type="submit">Submit</button>,
  CancelButton: (props) => <button {...props} type="button">Cancel</button>,
  FormProvider: ({ children, onSubmit, onValidate }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ data: { value: {} } });
      }}
      onValidate={(e) => {
        e.preventDefault();
        onValidate({ data: { value: {} } });
      }}
    >
      {children}
    </form>
  ),
  FormView: ({ children }) => <div>{children}</div>,
}));
jest.mock("uu5g05-elements", () => ({
  ...jest.requireActual("uu5g05-elements"),
  Modal: ({ children, open }) => (open ? <div>{children}</div> : null),
  useAlertBus: () => ({ addAlert: jest.fn() }),
}));
describe('UpdateModal Component', () => {
  const mockRecipeDataObject = {
    data: {
      name: "Test Recipe",
      categoryIdList: [1, 2],
      imageFile: "test-image.jpg",
      text: "Test text",
    }
  };

  const mockCategoryList = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
  ];

  const mockOnSubmit = jest.fn().mockResolvedValue({});
  const mockOnCancel = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('renders with default props', () => {
    const { getByLabelText } = render(<UpdateModal recipeDataObject={mockRecipeDataObject} categoryList={mockCategoryList} />);
    expect(getByLabelText(/Name/i)).toBeInTheDocument();
    expect(getByLabelText(/Category/i)).toBeInTheDocument();
    expect(getByLabelText(/Image/i)).toBeInTheDocument();
    expect(getByLabelText(/Text/i)).toBeInTheDocument();
  });
  test('calls onSubmit prop on form submission', async () => {
    const { getByText } = render(<UpdateModal recipeDataObject={mockRecipeDataObject} categoryList={mockCategoryList} onSubmit={mockOnSubmit} />);
    fireEvent.click(getByText(/Submit/i));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
  test('displays alert on successful form submission', async () => {
    const { addAlert } = useAlertBus();
    const { getByText } = render(<UpdateModal recipeDataObject={mockRecipeDataObject} categoryList={mockCategoryList} onSubmit={mockOnSubmit} />);
    fireEvent.click(getByText(/Submit/i));
    await waitFor(() => {
      expect(addAlert).toHaveBeenCalledWith({
        message: "Recipe updated: Test Recipe",
        priority: "success",
        durationMs: 2000,
      });
    });
  });
  test('calls onCancel prop on cancel button click', () => {
    const { getByText } = render(<UpdateModal recipeDataObject={mockRecipeDataObject} categoryList={mockCategoryList} onCancel={mockOnCancel} />);
    fireEvent.click(getByText(/Cancel/i));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
  test('validates form correctly', async () => {
    const { getByText } = render(<UpdateModal recipeDataObject={mockRecipeDataObject} categoryList={mockCategoryList} onSubmit={mockOnSubmit} />);
    fireEvent.submit(getByText(/Submit/i));
    await waitFor(() => {
      expect(getByText("Please provide either text or image.")).toBeInTheDocument();
    });
  });
});
