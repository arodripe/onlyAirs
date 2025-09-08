-- Seed 20 fans and one live match window (6 hours)

-- Countries pool
with f as (
  select * from (values
  ('Fan 1','US'),('Fan 2','ES'),('Fan 3','BR'),('Fan 4','FR'),('Fan 5','GB'),
  ('Fan 6','DE'),('Fan 7','AR'),('Fan 8','CO'),('Fan 9','US'),('Fan 10','ES'),
  ('Fan 11','BR'),('Fan 12','FR'),('Fan 13','GB'),('Fan 14','DE'),('Fan 15','AR'),
  ('Fan 16','CO'),('Fan 17','US'),('Fan 18','ES'),('Fan 19','BR'),('Fan 20','FR')
  ) as t(display_name, country_code)
)
insert into fan (display_name, image_url, country_code)
select display_name,
       'https://picsum.photos/seed/onlyairs-' || row_number() over () || '/600/600.webp',
       country_code
from f;

-- Pick the newest two fans as challengers
with latest as (
  select id from fan order by created_at desc limit 2
)
insert into match (challenger1_id, challenger2_id, start_at, end_at)
select (array_agg(id))[2], (array_agg(id))[1], now(), now() + interval '6 hours'
from latest;


