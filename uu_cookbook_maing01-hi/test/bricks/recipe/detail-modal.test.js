import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailModal from '../../../src/bricks/recipe/detail-modal';

jest.mock('uu5g05-elements', () => ({
  Modal: ({ children, ...props }) => <div {...props}>{children}</div>,
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Line: (props) => <hr {...props} />,
  Text: ({ children, ...props }) => <span {...props}>{children}</span>,
  DateTime: (props) => <span {...props}>{props.value.toString()}</span>,
}));

jest.mock('uu_plus4u5g02-elements', () => ({
  PersonPhoto: (props) => <img {...props} alt="person" />,
}));

describe('DetailModal Component', () => {
  const recipeDataObject = {
    state: 'ready',
    data: {
      name: 'Test Recipe',
      text: 'This is a test recipe',
      imageUrl: 'http://example.com/image.jpg',
      categoryIdList: [1, 2],
      sys: { cts: '2023-06-24T12:00:00Z' },
      uuIdentity: '12345',
      uuIdentityName: 'Test User',
      ratingCount: 10,
      averageRating: 4.5,
    },
  };

  const categoryList = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ];

  const defaultProps = {
    recipeDataObject,
    categoryList,
    onClose: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };
  test('renders with required props', () => {
    const { container } = render(<DetailModal {...defaultProps} />);
    const headerElement = container.querySelector('[header="Test Recipe"]');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveAttribute('header', 'Test Recipe');
  });  
  test('renders recipe text and image', () => {
    const { getByText, getByAltText } = render(<DetailModal {...defaultProps} />);
    expect(getByText('This is a test recipe')).toBeInTheDocument();
    expect(getByAltText('Test Recipe')).toBeInTheDocument();
  });
  test('renders category names', () => {
    const { getByText } = render(<DetailModal {...defaultProps} />);
    expect(getByText('Category 1, Category 2')).toBeInTheDocument();
  });
  test('renders creation date', () => {
    const { getByText } = render(<DetailModal {...defaultProps} />);
    expect(getByText('2023-06-24T12:00:00Z')).toBeInTheDocument();
  });
  test('renders rating count and average rating', () => {
    const { getByText } = render(<DetailModal {...defaultProps} />);
    expect(getByText('Rating: 10')).toBeInTheDocument();
    expect(getByText('Average Rating: 4.5')).toBeInTheDocument();
  });
  test('renders person photo and name', () => {
    const { getByAltText, getByText } = render (<DetailModal {...defaultProps} />);
    expect(getByAltText('person')).toBeInTheDocument();
    expect(getByText('Test User')).toBeInTheDocument();
  });
  test('calls onUpdate callback when update button is clicked', () => {
    const { getByRole } = render(<DetailModal {...defaultProps} />);
    fireEvent.click(getByRole("button", { name: /update/i }));
    expect(defaultProps.onUpdate).toHaveBeenCalledWith(recipeDataObject);
  }); // can't find the button
  test('calls onDelete callback when delete button is clicked', () => {
    const { container } = render(<DetailModal {...defaultProps} />);
    const deleteButton = container.querySelector('[data-testid="icon"].mdi-delete');
    fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalledWith(recipeDataObject);
  }); // can't find the button
});
