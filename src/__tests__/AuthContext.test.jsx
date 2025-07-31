import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import useAuth from '@/hooks/useAuth';

function Consumer() {
  const value = useAuth();
  Consumer.value = value;
  return null;
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  test('signup then login sets user', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await act(async () => {
      const p = Consumer.value.signup('Test User', 'test@example.com', 'pass');
      jest.runAllTimers();
      await p;
    });

    expect(Consumer.value.user.email).toBe('test@example.com');

    act(() => {
      Consumer.value.logout();
    });
    expect(Consumer.value.user).toBeNull();

    await act(async () => {
      const p = Consumer.value.login('test@example.com', 'pass');
      jest.runAllTimers();
      await p;
    });

    expect(Consumer.value.user.email).toBe('test@example.com');
  });

  test('login with wrong credentials rejects', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await expect(
      act(async () => {
        const p = Consumer.value.login('bad@example.com', 'nope');
        jest.runAllTimers();
        await p;
      })
    ).rejects.toThrow();
  });
});
