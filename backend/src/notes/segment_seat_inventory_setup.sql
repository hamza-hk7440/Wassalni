-- Run this in Supabase SQL Editor before enabling segment-based seat reservation in production.
-- Purpose: track seat inventory per schedule segment (between consecutive stations).

create table if not exists public.schedule_segments (
  segment_id uuid primary key default gen_random_uuid(),
  schedule_id text not null,
  from_station_id text not null,
  to_station_id text not null,
  from_order integer not null,
  to_order integer not null,
  capacity integer not null check (capacity >= 0),
  available_seats integer not null check (available_seats >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_schedule_segments_order check (from_order < to_order),
  constraint uq_schedule_segments_window unique (schedule_id, from_order, to_order)
);

create index if not exists idx_schedule_segments_schedule
  on public.schedule_segments(schedule_id, from_order, to_order);

create index if not exists idx_schedule_segments_stations
  on public.schedule_segments(schedule_id, from_station_id, to_station_id);

create or replace function public.set_schedule_segments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_schedule_segments_updated_at on public.schedule_segments;
create trigger trg_schedule_segments_updated_at
before update on public.schedule_segments
for each row execute function public.set_schedule_segments_updated_at();

alter table public.schedule_segments enable row level security;

drop policy if exists "service_role_manage_schedule_segments" on public.schedule_segments;
create policy "service_role_manage_schedule_segments"
on public.schedule_segments
for all
to service_role
using (true)
with check (true);

-- Optional backfill for existing schedules:
-- This fills segment rows from route_stations and transport capacity.
insert into public.schedule_segments (
  schedule_id,
  from_station_id,
  to_station_id,
  from_order,
  to_order,
  capacity,
  available_seats
)
select
  s.schedule_id,
  rs_from.station_id as from_station_id,
  rs_to.station_id as to_station_id,
  rs_from.sequence_order as from_order,
  rs_to.sequence_order as to_order,
  t.capacity,
  least(coalesce(s.available_seats, t.capacity), t.capacity) as available_seats
from public.schedules s
join public.transports t
  on t.transport_id = s.transport_id
join public.route_stations rs_from
  on rs_from.route_id = s.route_id
join public.route_stations rs_to
  on rs_to.route_id = s.route_id
 and rs_to.sequence_order = rs_from.sequence_order + 1
on conflict (schedule_id, from_order, to_order) do nothing;
