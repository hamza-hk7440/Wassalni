-- Run this in Supabase SQL Editor (project database)
-- Goal: allow backend server-side payment flow to insert/update transactions
-- and apply recharge balance updates from Paymee webhook.

-- 1) Ensure RLS is enabled (safe if already enabled)
alter table public.transactions enable row level security;
alter table public.users enable row level security;

-- 2) Allow service_role to fully manage transactions
-- (needed for createRecharge insert + webhook status update)
drop policy if exists "service_role_manage_transactions" on public.transactions;
create policy "service_role_manage_transactions"
on public.transactions
for all
to service_role
using (true)
with check (true);

-- 3) Allow service_role to update user token balance
-- (needed for webhook updateTokenBalance)
drop policy if exists "service_role_update_users" on public.users;
create policy "service_role_update_users"
on public.users
for update
to service_role
using (true)
with check (true);

-- 4) (Optional but recommended) passenger can read own transactions
drop policy if exists "passenger_select_own_transactions" on public.transactions;
create policy "passenger_select_own_transactions"
on public.transactions
for select
to authenticated
using (auth.uid() = user_id);

-- 5) (Optional) passenger can insert own transaction when using user JWT context
drop policy if exists "passenger_insert_own_transactions" on public.transactions;
create policy "passenger_insert_own_transactions"
on public.transactions
for insert
to authenticated
with check (auth.uid() = user_id);
