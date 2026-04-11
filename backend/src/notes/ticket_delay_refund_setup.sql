-- Run this in Supabase SQL Editor before using delay/cancellation/refund features.

-- 1) Announcements table (delay + cancellation per schedule)
create table if not exists public.ticket_announcements (
  announcement_id uuid primary key default gen_random_uuid(),
  schedule_id text not null,
  type text not null check (type in ('delay', 'cancellation')),
  delay_minutes integer not null default 0,
  message text,
  is_active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ticket_announcements_schedule_active
  on public.ticket_announcements(schedule_id, is_active, created_at desc);

-- 2) Refund requests table (test mode: release_at in 2 min)
create table if not exists public.refund_requests (
  refund_request_id uuid primary key default gen_random_uuid(),
  ticket_id text not null,
  user_id text not null,
  amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'completed', 'rejected')),
  requested_at timestamptz not null default now(),
  release_at timestamptz,
  completed_at timestamptz,
  processed boolean not null default false
);

create index if not exists idx_refund_requests_user_status_release
  on public.refund_requests(user_id, status, release_at);

create index if not exists idx_refund_requests_ticket
  on public.refund_requests(ticket_id, requested_at desc);

-- 3) Service-role policies (if RLS is enabled)
alter table public.ticket_announcements enable row level security;
alter table public.refund_requests enable row level security;

drop policy if exists "service_role_manage_ticket_announcements" on public.ticket_announcements;
create policy "service_role_manage_ticket_announcements"
on public.ticket_announcements
for all
to service_role
using (true)
with check (true);

drop policy if exists "service_role_manage_refund_requests" on public.refund_requests;
create policy "service_role_manage_refund_requests"
on public.refund_requests
for all
to service_role
using (true)
with check (true);

-- 4) Optional: authenticated users can view own refund requests
drop policy if exists "passenger_select_own_refund_requests" on public.refund_requests;
create policy "passenger_select_own_refund_requests"
on public.refund_requests
for select
to authenticated
using (auth.uid()::text = user_id);
