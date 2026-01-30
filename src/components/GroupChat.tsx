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
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow p-4 flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold text-[var(--purple)]">{msg.username}:</span>
            <span className="ml-2">{msg.message}</span>
            <span className="ml-2 text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded-full px-3 py-2 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-[var(--purple)] text-white px-4 py-2 rounded-full font-semibold">Send</button>
      </form>
    </div>
  );
}
