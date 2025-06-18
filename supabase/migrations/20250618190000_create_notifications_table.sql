create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamp with time zone not null default now()
);
create index if not exists idx_notifications_user_id on notifications(user_id); 