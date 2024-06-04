import { render, screen } from '@testing-library/react';
import App from '../App';

test('Should render the main component', () => {
  render(<App />);
  const linkElement = screen.getByText(/Its working!/i);
  expect(linkElement).toBeInTheDocument();
});
