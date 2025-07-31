import React from 'react';
import { render, act } from '@testing-library/react';
import { ChatProvider } from '@/contexts/ChatContext';
import { AuthProvider } from '@/contexts/AuthContext';
import useChat from '@/hooks/useChat';

jest.mock('@/components/ui/use-toast', () => ({ toast: jest.fn() }));

function Consumer() {
  const value = useChat();
  Consumer.value = value;
  return null;
}

const user = { id: 'user1', email: 'test@example.com' };

describe('ChatContext', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('alyaUser', JSON.stringify(user));
  });

  test('create conversation and add message', () => {
    render(
      <AuthProvider>
        <ChatProvider>
          <Consumer />
        </ChatProvider>
      </AuthProvider>
    );

    act(() => {
      Consumer.value.createConversation('Hello');
    });

    expect(Consumer.value.conversations[0].name).toBe('Hello');

    act(() => {
      Consumer.value.addMessage(Consumer.value.conversations[0].id, 'user', 'Hi');
    });

    expect(Consumer.value.conversations[0].messages[1].text).toBe('Hi');
  });
});
