import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tile from '../../../src/bricks/joke/tile.js'

describe('Tile Component', () => {
  test('renders New Years resolution text', () => {
    const { getByText } = render(<Tile />);
    const resolutionText = getByText(/My New Years' resolution is 8K./i);
    expect(resolutionText).toBeInTheDocument();
  });
  test('renders the correct image', () => {
    const { getByRole } = render(<Tile />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', 'https://picsum.photos/id/164/640/320');
  });
  test('average rating is displayed correctly', () => {
    const { getByText } = render(<Tile />);
    const ratingText = getByText(/Average rating: 3 \/ 5/i);
    expect(ratingText).toBeInTheDocument();
  });
  test('update button triggers alert when clicked', () => {
    window.alert = jest.fn();
    const { getByRole } = render(<Tile />);
    const updateButton = getByRole('button', { name: /update/i });
    fireEvent.click(updateButton);
    expect(window.alert).toHaveBeenCalledWith("I can't update joke. I'm dumb visual component.");
  });
});