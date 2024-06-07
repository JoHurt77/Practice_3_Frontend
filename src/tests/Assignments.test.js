import React from 'react';
import { render, screen } from '@testing-library/react';
import Assignments from '../pages/Assignments';

test('should render a button', () => {
  render(<Assignments />);
  const table = screen.getAllByRole('table');
  expect(table).toBeInTheDocument();
});

