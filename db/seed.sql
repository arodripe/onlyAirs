-- Seed from fixtures: 20 fans with explicit metadata and one live match (6 hours)
-- Safe for local dev. Will TRUNCATE existing data.

create extension if not exists pgcrypto;

with fixtures(display_name, description, image_url, country_code, created_at) as (
  values
  ('El de mi cocina','El ventilador que salva las noches de verano.','/ventiladorCocina.webp','US','2025-08-20T00:00:00Z'::timestamptz),
  ('Guapisimo de mi casa','Elegante y silencioso, como mi salón.','/ventiladorCasaNormal.webp','ES','2025-08-21T00:00:00Z'::timestamptz),
  ('Votad por mi hijo','El favorito del peque: turbo modo ON.','/VentiladorCuartroNino.webp','BR','2025-08-22T00:00:00Z'::timestamptz),
  ('baguetteéventail de baguettes ','Refresca y cruje (baguettes no incluidas).','/VentiladorEnLaCalle.webp','FR','2025-08-23T00:00:00Z'::timestamptz),
  ('Brexit Fan','Sopla a su aire, pase lo que pase.','/VentiladorCuartroNino.webp','GB','2025-08-24T00:00:00Z'::timestamptz),
  ('Wurstfan','Bratwurst-friendly airflow.','/ventiladorSalon.webp','DE','2025-08-25T00:00:00Z'::timestamptz),
  ('Grande Diego!','Con alma albiceleste.','/ventiladorCasaNormal.webp','AR','2025-08-26T00:00:00Z'::timestamptz),
  ('Fartilador','No preguntes, solo ventila.','/VentiladorTechoNormal.webp','CO','2025-08-27T00:00:00Z'::timestamptz),
  ('America','Stars, stripes and breeze.','/VentiladorEnLaCalle.webp','US','2025-08-28T00:00:00Z'::timestamptz),
  ('Arriba Ventilandia','El presidente del aire fresco.','/ventiladorCasaPijo.webp','ES','2025-08-29T00:00:00Z'::timestamptz),
  ('samba','Baila el aire.','/VentiladorTechoNormal.webp','BR','2025-08-30T00:00:00Z'::timestamptz),
  ('ulala','Très chic et très cool.','/ventiladorSalon.webp','FR','2025-08-31T00:00:00Z'::timestamptz),
  ('The Queen Fan','Dios salve al ventilador.','/ventiladorCasaPijo.webp','GB','2025-09-01T00:00:00Z'::timestamptz),
  ('mein Fan','Ordnung und Luft.','/ventiladorCocina.webp','DE','2025-09-02T00:00:00Z'::timestamptz),
  ('vamos los pibes','Aguante la frescura.','/ventiladorCasaPijo.webp','AR','2025-09-03T00:00:00Z'::timestamptz),
  ('Plata o ventilador','Ventila o plomo.','/VentiladorCuartroNino.webp','CO','2025-09-04T00:00:00Z'::timestamptz),
  ('Hallowfan','Booo… breeze!','/VentiladorEnLaCalle.webp','US','2025-09-05T00:00:00Z'::timestamptz),
  ('Torero','Olé, qué airecito.','/ventiladorSalon.webp','ES','2025-09-06T00:00:00Z'::timestamptz),
  ('Maracafan','Samba de aire. Recién traído de rio de janeiro, se lo compré a un señor de 50 años que estaba fumando un joint en mitad de la calle, muy simpático pero tenía un olor un poco fuerte.','/ventiladorCasaNormal.webp','BR','2025-09-07T00:00:00Z'::timestamptz),
  ('Ugly Grandma Fan','Feo pero fiel. justo lo contrario que tu ex.','/VentiladorTechoNormal.webp','FR','2025-09-08T00:00:00Z'::timestamptz)
),
ins as (
  insert into fan (display_name, description, image_url, country_code, created_at)
  select display_name, description, image_url, country_code, created_at
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