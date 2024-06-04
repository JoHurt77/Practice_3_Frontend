import { render, screen } from '@testing-library/react';
import AddButton from '../components/AddButton';

describe('AddButton', () => {

  test('should render a button', () => {
    render(<AddButton />);
    const buttons = screen.getAllByRole('button', {title:"Add New Field"});
    expect(buttons[0]).toBeInTheDocument();
  });

});