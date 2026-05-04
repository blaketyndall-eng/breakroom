insert into public.lost_objects (slug, name, object_type, description, meaning, status, is_public)
values
  ('rosary-with-broken-clasp', 'Rosary With Broken Clasp', 'cultural', 'Found wrapped around a cracked Nokia charger behind the display case.', 'Faith that stayed even after the clasp gave up.', 'cataloged', true),
  ('cracked-nokia-voicemail-light', 'Cracked Nokia With Voicemail Light', 'digital', 'Screen spidered. Battery icon empty. Voicemail light still blinking like it owes somebody money.', 'A dead phone with live consequences.', 'cataloged', true),
  ('pawn-ticket-amber-case', 'Pawn Ticket From Amber Case', 'physical', 'A pawn ticket with the item field left blank and the date written twice.', 'Collateral for something nobody admits owning.', 'archived', true),
  ('boxing-glove-relic-left', 'Single Boxing Glove Hung Like A Relic', 'physical', 'Left glove only. Lace tied around a nail near the back office door.', 'Proof of a fight edited down to one object.', 'displayed', true),
  ('saint-card-cash-drawer', 'Saint Card From Cash Drawer', 'cultural', 'Laminated, bent, and warm from the drawer light. A gold chain was taped to the back once.', 'Protection for money that keeps leaving.', 'held', true),
  ('motel-lamp-pull-chain', 'Motel Lamp Pull Chain', 'physical', 'Detached from a lamp that still turns on when the room wants it.', 'Light without consent.', 'cataloged', true),
  ('title-belt-takeout-grease', 'Title Belt With Takeout Grease', 'physical', 'Brass plate, no champion. Grease print over the name field.', 'Victory after dinner, or dinner after victory.', 'evidence', true),
  ('white-dog-hair-glass-counter', 'White Dog Hair Under Glass Counter', 'physical', 'Three hairs sealed in tape under the display glass. Dog not available for comment.', 'A witness asleep during the important part.', 'cataloged', true),
  ('lowrider-air-freshener', 'Lowrider Air Freshener Shaped Like A Crown', 'physical', 'Found in the lot after the bass stopped. Smells like pine, chrome, and old heat.', 'Royalty assigned by the dashboard.', 'in_rotation', true),
  ('printer-friendly-prayer-card', 'Printer-Friendly Prayer Card', 'digital', 'Downloaded from a page with no author and a visitor counter stuck at 000147.', 'A sacred file saved in the wrong folder.', 'displayed', true),
  ('vending-machine-quarter-1979', 'Vending Machine Quarter From 1979', 'physical', 'Rejected six times by the machine, accepted once by a pool table.', 'Currency that chooses its own economy.', 'held', true),
  ('fur-coat-claim-check', 'Fur Coat Claim Check', 'physical', 'Number 88. No coat came with it. Nobody cold enough to ask.', 'Luxury without a body.', 'archived', true)
on conflict (slug) do update set
  name = excluded.name,
  object_type = excluded.object_type,
  description = excluded.description,
  meaning = excluded.meaning,
  status = excluded.status,
  is_public = excluded.is_public;

insert into public.news_items (slug, title, body, category, byline, is_true, is_public)
values
  ('pawn-shop-window-declared-chapel', 'PAWN SHOP WINDOW DECLARED TEMPORARY CHAPEL', 'Witnesses reported rosaries, title belts, cracked phones, and one sleeping white dog arranged with unusual authority.', 'sightings', 'LOT RELIGION DESK', false, true),
  ('finance-denies-hot-air-balloon-insurance', 'FINANCE DENIES KNOWLEDGE OF HOT AIR BALLOON INSURANCE DIVISION', 'The AI approved the policy, the sky declined coverage, and legal asked everyone to stop saying vertical liability.', 'ventures', 'OMNISHIFT BUSINESS', false, true),
  ('bar-mirror-returns-different-man', 'BAR MIRROR RETURNS DIFFERENT MAN THAN ONE PROVIDED', 'The source could not be reached for comment. The room declined to answer because it was busy being a room.', 'breaking', '3AM EDITION', false, true),
  ('pool-table-holds-private-service', 'POOL TABLE HOLDS PRIVATE SERVICE FOR MISSING EIGHT BALL', 'No flowers were requested. Cue chalk was accepted in lieu of grief.', 'sports', 'POOLHALL DESK', false, true),
  ('motel-office-sells-sainthood-by-hour', 'MOTEL OFFICE ACCUSED OF SELLING SAINTHOOD BY THE HOUR', 'Management says the halo deposit is refundable if returned without smoke damage.', 'notices', 'MOTEL DESK', false, true),
  ('delivery-driver-refuses-enter-after-hours', 'DELIVERY DRIVER REFUSES TO ENTER AFTER HOURS, LEAVES FOOD WITH CLOCK', 'Clock accepted the order and tipped nothing. The bag was warm for forty-seven minutes.', 'public_notice', 'FOOD COURT STRINGER', true, true),
  ('ai-announces-byob-petting-zoo-review', 'AI ANNOUNCES BYOB PETTING ZOO STILL UNDER SPIRITUAL REVIEW', 'Early reports suggest the goats are unionizing and the cooler policy remains unresolved.', 'ventures', 'OMNISHIFT EXPANSION', false, true),
  ('cash-drawer-found-praying', 'CASH DRAWER FOUND PRAYING UNDER AMBER LIGHT', 'Employees were advised not to interrupt the drawer unless making exact change.', 'sightings', 'COUNTER STAFF', false, true)
on conflict (slug) do update set
  title = excluded.title,
  body = excluded.body,
  category = excluded.category,
  byline = excluded.byline,
  is_true = excluded.is_true,
  is_public = excluded.is_public;

insert into public.phone_messages (slug, from_label, message_type, body, unlock_level, is_public)
values
  ('unknown-woman-counter-wipe', 'Unknown Woman At The Counter', 'voicemail', '[one wipe across glass] You left the ticket but not the item. Come before the lamp turns blue.', 1, true),
  ('pawnshop-owner-watch', 'Pawnshop Owner', 'voicemail', 'He set the watch down and it kept the wrong time. That means it belongs to you now.', 1, true),
  ('motel-front-desk-lamp', 'Motel Front Desk', 'voicemail', 'Room 147 is not available because it is not a room. Do you still want the key?', 2, true),
  ('dog-breathing-under-counter', 'Breathing Under Counter', 'voicemail', '[soft dog breathing] [fluorescent hum] [coin drops somewhere too far away]', 2, true),
  ('omni-ai-vertical-liability', 'OmniShift AI', 'voicemail', 'Congratulations. You have been pre-approved for hot air balloon insurance. Please remain grounded while we process the sky.', 0, true),
  ('water-burger-night-window', 'Water Burger Night Window', 'voicemail', 'Your number was called, but the meal got wet. Pull around again if you still believe in dinner.', 0, true),
  ('radio-station-id-bad-tape', 'Radio 1:47 Station ID', 'voicemail', 'You are listening to Channel 1:47. If you hear yourself, lower the volume and apologize to nobody.', 0, true)
on conflict (slug) do update set
  from_label = excluded.from_label,
  message_type = excluded.message_type,
  body = excluded.body,
  unlock_level = excluded.unlock_level,
  is_public = excluded.is_public;

insert into public.ventures (slug, name, status, description, memo, is_public)
values
  ('motel-sainthood-program', 'OmniShift Motel Sainthood Program', 'announced_by_ai', 'Hourly halos, refundable deposits, and light housekeeping for spiritually complicated guests.', 'The AI believes sanctity has strong margin potential after midnight.', true),
  ('vertical-liability-group', 'Vertical Liability Group', 'announced_by_ai', 'Hot air balloon insurance, ladder regret coverage, and elevator silence protection.', 'Risk model trained on clouds and executive optimism.', true),
  ('water-burger-night-window', 'Water Burger Night Window', 'pilot', 'Retro burger window where the food is normal until the receipt gets damp.', 'Do not call it wet. Legal prefers hydrated.', true),
  ('glass-counter-custody', 'Glass Counter Custody', 'under_review', 'A premium evidence storage concept for jewelry, phone chargers, saint cards, and small sleeping dogs.', 'The dog is not included in the pricing model.', true),
  ('applause-money-clearinghouse', 'Applause Money Clearinghouse', 'announced_by_ai', 'A fake financial institution for converting crowd approval into non-reimbursable morale.', 'Finance has blocked the domain three times.', true)
on conflict (slug) do update set
  name = excluded.name,
  status = excluded.status,
  description = excluded.description,
  memo = excluded.memo,
  is_public = excluded.is_public;

insert into public.secrets (slug, level, clue, payload, is_active)
values
  ('rosary-nokia-counter', 3, 'The prayer and the phone share a charger.', '{"route":"/lost-found","requires":["rosary-with-broken-clasp","cracked-nokia-voicemail-light"]}'::jsonb, true),
  ('title-belt-takeout', 2, 'The champion ate before the decision.', '{"route":"/newsstand","query":"title belt"}'::jsonb, true),
  ('white-dog-under-glass', 4, 'The witness slept through the inventory count.', '{"route":"/after-hours","object":"white-dog-hair-glass-counter"}'::jsonb, true),
  ('motel-lamp-room-147', 4, 'The lamp opens rooms the key denies.', '{"route":"/room-8","requires":["motel-lamp-pull-chain","motel-key-147"]}'::jsonb, true),
  ('printer-prayer-sleepernet', 3, 'The sacred file has a visitor counter.', '{"route":"/sleeper-net","query":"printer friendly prayer"}'::jsonb, true)
on conflict (slug) do update set
  level = excluded.level,
  clue = excluded.clue,
  payload = excluded.payload,
  is_active = excluded.is_active;
