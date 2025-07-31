import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

function Wrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

test('toggles theme value in localStorage', () => {
  const { getByRole } = render(<ThemeToggle />, { wrapper: Wrapper });
  const button = getByRole('button');
  const first = localStorage.getItem('alya-ui-theme') || 'system';
  fireEvent.click(button);
  const after = localStorage.getItem('alya-ui-theme');
  expect(after).not.toBe(first);
});
