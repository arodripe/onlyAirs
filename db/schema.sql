-- Postgres schema for OnlyAirs MVP

create extension if not exists pgcrypto;

create table if not exists fan (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  image_url text not null,
  country_code char(2) not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists match (
  id uuid primary key default gen_random_uuid(),
  challenger1_id uuid not null references fan(id) on delete restrict,
  challenger2_id uuid not null references fan(id) on delete restrict,
  start_at timestamptz not null,
  end_at timestamptz not null,
  winner_fan_id uuid references fan(id) on delete set null
);

create table if not exists clap (
  id bigserial primary key,
  match_id uuid not null references match(id) on delete cascade,
  fan_id uuid not null references fan(id) on delete cascade,
  count integer not null default 1,
  created_at timestamptz not null default now()
);

-- later: ip_hash for integrity, unique per (match_id, ip_hash)

-- Aggregated totals per match/fan for fast reads
create table if not exists match_fan_totals (
  match_id uuid not null references match(id) on delete cascade,
  fan_id uuid not null references fan(id) on delete cascade,
  total integer not null default 0,
  primary key (match_id, fan_id)
);

-- Trigger to keep totals up to date on clap insert
create or replace function clap_increment_total()
returns trigger as $$
begin
  insert into match_fan_totals(match_id, fan_id, total)
  values (new.match_id, new.fan_id, new.count)
  on conflict(match_id, fan_id) do update set total = match_fan_totals.total + excluded.total;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_clap_increment_total on clap;
create trigger trg_clap_increment_total
after insert on clap
for each row execute procedure clap_increment_total();

-- Convenience view joining match and totals (optional for reporting)
create or replace view match_totals as
select m.id as match_id, t.fan_id, t.total
from match m
join match_fan_totals t on t.match_id = m.id;


-- Request rate limiting (fixed window per key)
create table if not exists rate_limit (
  key text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (key, window_start)
);

