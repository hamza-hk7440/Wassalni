-- Run this in Supabase SQL Editor.
-- Purpose: track whether a recharge transaction has actually been credited to the user balance.

alter table public.transactions
add column if not exists credited boolean not null default false;

-- Optional: index to help lookups by status/credited state.
create index if not exists transactions_credited_idx
on public.transactions (credited);
