-- Group Chat Table
create table if not exists group_chats (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists group_chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references group_chats(id) on delete cascade,
  user_id uuid not null,
  username text,
  message text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Index for fast retrieval
create index if not exists idx_group_chat_messages_chat_id_created_at on group_chat_messages(chat_id, created_at desc);
