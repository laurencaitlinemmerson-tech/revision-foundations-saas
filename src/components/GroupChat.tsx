import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseGroupChat';
import { useUser } from '@clerk/nextjs';

interface Message {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

export default function GroupChat({ chatId }: { chatId: string }) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel('group_chat_' + chatId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_chat_messages', filter: `chat_id=eq.${chatId}` }, (payload) => {
        setMessages((msgs) => [...msgs, payload.new as Message]);
      })
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [chatId]);

  async function fetchMessages() {
    const { data } = await supabase
      .from('group_chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;
    await supabase.from('group_chat_messages').insert({
      chat_id: chatId,
      user_id: user.id,
      username: user.fullName || user.username || 'Anonymous',
      message: input.trim(),
    });
    setInput('');
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className="mx-auto flex h-[500px] w-full max-w-lg flex-col p-4"
      style={{
        background: '#FFFEFC',
        border: '0.5px solid rgba(26,24,21,0.1)',
      }}
    >
      <div className="mb-2 flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2 border-b border-black/6 pb-2">
            <span style={{ fontWeight: 600, color: '#1A1815' }}>{msg.username}:</span>
            <span className="ml-2" style={{ color: '#5A5750' }}>{msg.message}</span>
            <span className="ml-2 text-xs" style={{ color: '#9A948C' }}>{new Date(msg.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 focus:outline-none"
          style={{ borderColor: 'rgba(26,24,21,0.12)', background: '#FBF8F3' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="px-4 py-2 font-semibold" style={{ background: '#1A1815', color: '#FAFAF8' }}>Send</button>
      </form>
    </div>
  );
}
