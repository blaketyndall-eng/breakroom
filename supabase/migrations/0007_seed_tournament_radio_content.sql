insert into public.radio_logs (title, body, aired_at)
values
  ('Channel 1:47 Station ID', 'You are listening to Channel 1:47. If you hear yourself, lower the volume and apologize to nobody.', now()),
  ('The Lot Weather Report', 'Sodium-vapor glow with a chance of lowrider breathing near the vacancy sign. Bring a hoodie after the bass stops.', now()),
  ('Applause Money Market Minute', 'Finance confirms applause money remains non-taxable, non-reimbursable, and emotionally volatile.', now()),
  ('Idle Hands Bracket Break', 'Nun Dog versus Time remains ongoing. Mugsy is late again. Table four says it saw nothing.', now()),
  ('Water Burger Night Window Ad', 'Pull around again if you still believe in dinner. The receipt may be damp but the bag is warm.', now()),
  ('Motel Sainthood Legal Notice', 'Hourly halos require a refundable deposit and may not be returned with smoke damage.', now())
on conflict do nothing;

insert into public.news_items (slug, title, body, category, byline, is_true, is_public)
values
  ('nun-dog-vs-time-still-ongoing', 'NUN DOG VS TIME STILL ONGOING', 'Officials refused to call the match because the clock was both witness and opponent.', 'sports', 'IDLE HANDS DESK', false, true),
  ('mugsy-late-again-table-changed', 'MUGSY LATE AGAIN, TABLE CHANGED WITHOUT HIM', 'Witnesses say the bracket moved itself after the third apology.', 'sports', 'POOLHALL DESK', true, true),
  ('radio-147-heard-inside-vending-machine', 'RADIO 1:47 HEARD INSIDE VENDING MACHINE', 'The machine rejected a quarter, accepted a prayer card, and played the weather report backwards.', 'radio', 'CHANNEL 1:47', false, true),
  ('miss-september-declines-interview-through-feather', 'MISS SEPTEMBER DECLINES INTERVIEW THROUGH FEATHER', 'A clean feather was placed on the counter. Staff accepted this as a full statement.', 'sports', 'ROSTER NOTES', false, true),
  ('table-four-denies-leaning', 'TABLE FOUR DENIES LEANING DESPITE TESTIMONY', 'The table said the floor started it. No charges were filed.', 'sports', 'HOUSE RULES', false, true)
on conflict (slug) do update set
  title = excluded.title,
  body = excluded.body,
  category = excluded.category,
  byline = excluded.byline,
  is_true = excluded.is_true,
  is_public = excluded.is_public;

insert into public.phone_messages (slug, from_label, message_type, body, unlock_level, is_public)
values
  ('nun-dog-table-prayer', 'Nun Dog', 'voicemail', 'I prayed over table three and it scratched on the break. That is between the table and the light.', 1, true),
  ('mugsy-running-late', 'Mugsy Late Again', 'voicemail', 'Put me down for the next match. I am almost there. Do not ask where there is.', 0, true),
  ('the-driver-lot-weather', 'The Driver', 'voicemail', 'Lot weather says bring a hoodie. Lot weather is me. I am outside.', 0, true),
  ('miss-september-feather-statement', 'Miss September', 'voicemail', '[silence] [feather placed on glass] [one pool ball drops somewhere off mic]', 2, true),
  ('channel-147-request-line', 'Channel 1:47 Request Line', 'voicemail', 'Leave your request after the tone. If the tone leaves first, follow it.', 0, true)
on conflict (slug) do update set
  from_label = excluded.from_label,
  message_type = excluded.message_type,
  body = excluded.body,
  unlock_level = excluded.unlock_level,
  is_public = excluded.is_public;

insert into public.secrets (slug, level, clue, payload, is_active)
values
  ('nun-dog-vs-time', 3, 'The opponent is the clock.', '{"route":"/idle-hands","query":"Nun Dog vs Time"}'::jsonb, true),
  ('radio-vending-machine', 2, 'The station plays where coins fail.', '{"route":"/radio","query":"vending machine"}'::jsonb, true),
  ('table-four-lean', 2, 'The floor started it.', '{"route":"/idle-hands","table":"4"}'::jsonb, true),
  ('miss-september-feather-statement', 3, 'The feather is the interview.', '{"route":"/phone","caller":"Miss September"}'::jsonb, true)
on conflict (slug) do update set
  level = excluded.level,
  clue = excluded.clue,
  payload = excluded.payload,
  is_active = excluded.is_active;
