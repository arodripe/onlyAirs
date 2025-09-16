-- Seed from fixtures: 20 fans with explicit metadata and one live match (6 hours)
-- Safe for local dev. Will TRUNCATE existing data.

create extension if not exists pgcrypto;

with fixtures(fan_index, display_name, image_url, country_code, created_at) as (
  values
  (1,'El de mi cocina','/ventiladorCocina.webp','US','2025-08-20T00:00:00Z'::timestamptz),
  (2,'Guapisimo de mi casa','/ventiladorCasaNormal.webp','ES','2025-08-21T00:00:00Z'::timestamptz),
  (3,'Votad por mi hijo','/VentiladorCuartroNino.webp','BR','2025-08-22T00:00:00Z'::timestamptz),
  (4,'baguetteéventail de baguettes ','/VentiladorEnLaCalle.webp','FR','2025-08-23T00:00:00Z'::timestamptz),
  (5,'Brexit Fan','/VentiladorCuartroNino.webp','GB','2025-08-24T00:00:00Z'::timestamptz),
  (6,'Wurstfan','/ventiladorSalon.webp','DE','2025-08-25T00:00:00Z'::timestamptz),
  (7,'Grande Diego!','/ventiladorCasaNormal.webp','AR','2025-08-26T00:00:00Z'::timestamptz),
  (8,'Fartilador','/VentiladorTechoNormal.webp','CO','2025-08-27T00:00:00Z'::timestamptz),
  (9,'America','/VentiladorEnLaCalle.webp','US','2025-08-28T00:00:00Z'::timestamptz),
  (10,'Arriba Ventilandia','/ventiladorCasaPijo.webp','ES','2025-08-29T00:00:00Z'::timestamptz),
  (11,'samba','/VentiladorTechoNormal.webp','BR','2025-08-30T00:00:00Z'::timestamptz),
  (12,'ulala','/ventiladorSalon.webp','FR','2025-08-31T00:00:00Z'::timestamptz),
  (13,'The Queen Fan','/ventiladorCasaPijo.webp','GB','2025-09-01T00:00:00Z'::timestamptz),
  (14,'mein Fan','/ventiladorCocina.webp','DE','2025-09-02T00:00:00Z'::timestamptz),
  (15,'vamos los pibes','/ventiladorCasaPijo.webp','AR','2025-09-03T00:00:00Z'::timestamptz),
  (16,'Plata o ventilador','/VentiladorCuartroNino.webp','CO','2025-09-04T00:00:00Z'::timestamptz),
  (17,'Hallowfan','/VentiladorEnLaCalle.webp','US','2025-09-05T00:00:00Z'::timestamptz),
  (18,'Torero','/ventiladorSalon.webp','ES','2025-09-06T00:00:00Z'::timestamptz),
  (19,'Maracafan','/ventiladorCasaNormal.webp','BR','2025-09-07T00:00:00Z'::timestamptz),
  (20,'Ugly Grandma Fan','/VentiladorTechoNormal.webp','FR','2025-09-08T00:00:00Z'::timestamptz)
),
ins as (
  insert into fan (display_name, image_url, country_code, created_at)
  select display_name, image_url, country_code, created_at
  from fixtures
  returning id, created_at
),
latest as (
  select id from ins order by created_at desc limit 2
),
mk_match as (
  insert into match (challenger1_id, challenger2_id, start_at, end_at)
  select (array_agg(id))[2], (array_agg(id))[1], now(), now() + interval '6 hours'
  from latest
  returning id
),
counts(fan_index, total) as (
  values
  (1,0),(2,0),(3,0),(4,0),(5,0),
  (6,1),(7,2),(8,3),(9,4),(10,5),
  (11,6),(12,7),(13,8),(14,9),(15,10),
  (16,11),(17,12),(18,13),(19,14),(20,15)
)
insert into match_fan_totals(match_id, fan_id, total)
select (select id from mk_match) as match_id, f.id, c.total
from counts c
join (
  select row_number() over (order by created_at) as fan_index, id
  from ins
) f on f.fan_index = c.fan_index;

