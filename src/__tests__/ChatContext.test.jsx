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
    localStorage.setItem('alyaSession', JSON.stringify({ user, token: 'tok' }));
    global.fetch = jest.fn((url, opts) => {
      if (url.endsWith('/api/conversations') && (!opts || !opts.method || opts.method === 'GET')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (url.endsWith('/api/projects') && (!opts || !opts.method || opts.method === 'GET')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (url.endsWith('/api/conversations') && opts.method === 'POST') {
        const body = JSON.parse(opts.body);
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ _id: 'conv1', name: body.name, messages: [], projectId: body.projectId }) });
      }
      if (url.includes('/api/conversations/') && opts.method === 'PUT') {
        const text = JSON.parse(opts.body).$push.messages.text;
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ _id: 'conv1', name: 'Hello', messages: [{ text }] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  test('create conversation and add message', async () => {
    render(
      <AuthProvider>
        <ChatProvider>
          <Consumer />
        </ChatProvider>
      </AuthProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await Consumer.value.createConversation('Hello');
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(Consumer.value.conversations[0].name).toBe('Hello');

    await act(async () => {
      await Consumer.value.addMessage(Consumer.value.conversations[0]._id || Consumer.value.conversations[0].id, 'user', 'Hi');
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(Consumer.value.conversations[0].messages[0]?.text || Consumer.value.conversations[0].messages[1].text).toBe('Hi');
  });
});
