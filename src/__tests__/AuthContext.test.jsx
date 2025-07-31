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
    global.fetch = jest.fn((url, opts) => {
      if (url.endsWith('/api/signup')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ token: 'tok', user: { id: '1', name: 'Test User', email: 'test@example.com' } })
        });
      }
      if (url.endsWith('/api/login')) {
        const body = JSON.parse(opts.body);
        if (body.email === 'test@example.com' && body.password === 'pass') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ token: 'tok', user: { id: '1', name: 'Test User', email: 'test@example.com' } })
          });
        }
        return Promise.resolve({ ok: false });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
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
