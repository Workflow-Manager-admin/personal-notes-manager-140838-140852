import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sidebar brand title', () => {
  render(<App />);
  const sidebarTitle = screen.getByText(/Notes/i);
  expect(sidebarTitle).toBeInTheDocument();
});

test('shows notes list and editor panel', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/search notes/i)).toBeInTheDocument();
  expect(screen.getByText(/Select or create a note/i)).toBeInTheDocument();
});
