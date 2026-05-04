insert into public.products (slug, name, sku, status, price_cents, category, description, reason, sort_order, is_public)
values
  ('stay-late-cap', 'Stay Late Cap', 'SE-05', 'available_for_issue', 4200, 'uniform_assignment', 'Staff issue. Do not lose. Replacements not authorized.', 'Night Audit item tied to fuzzy dice and lot hours.', 50, true),
  ('night-shift-hoodie', 'Night Shift Hoodie', 'SE-06', 'available_for_issue', 12000, 'uniform_assignment', 'For unresolved business.', 'Cold lots, bad coffee, and long conversations near closing.', 60, true)
on conflict (slug) do update set
  name = excluded.name,
  sku = excluded.sku,
  status = excluded.status,
  price_cents = excluded.price_cents,
  category = excluded.category,
  description = excluded.description,
  reason = excluded.reason,
  sort_order = excluded.sort_order,
  is_public = excluded.is_public;

insert into public.lost_objects (slug, name, object_type, description, meaning, status, is_public)
values
  ('wall-clock-147', 'Wall Clock Stuck At 1:47', 'room_myth', 'Found above the door. Condition: honest.', 'Time we agreed on.', 'displayed', true),
  ('matchbook-wrong-coat', 'Matchbook From The Wrong Coat', 'physical', 'Found in a coat pocket that denied ownership. Three left.', 'Three more reasons.', 'in_rotation', true),
  ('receipt-no-total', 'Receipt With No Total', 'physical', 'Folded into a matchbook. Coffee-ringed and unsigned.', 'Proof that the night happened.', 'archived', true),
  ('coffee-mug-active', 'Coffee Mug Chipped And Active', 'physical', 'Counter, four hours unattended. Still warm without permission.', 'Heat without source.', 'quarantined', true),
  ('hotline-poster-faded', 'Hotline Poster With Unreadable Numbers', 'cultural', 'Tacked over the payphone. Faded past usefulness.', 'Help, theoretical.', 'displayed', true)
on conflict (slug) do update set
  name = excluded.name,
  object_type = excluded.object_type,
  description = excluded.description,
  meaning = excluded.meaning,
  status = excluded.status,
  is_public = excluded.is_public;

insert into public.news_items (slug, title, body, category, byline, is_true, is_public)
values
  ('employee-denies-applying-accepts-role', 'EMPLOYEE DENIES APPLYING FOR JOB, ACCEPTS ROLE ANYWAY', 'Continued presence interpreted as consent, OmniShift confirms.', 'breaking', 'STAFF / 3:11 A.M.', false, true),
  ('lowrider-reported-breathing-near-vacancy-sign', 'LOWRIDER REPORTED BREATHING NEAR VACANCY SIGN', 'Idle for forty minutes. Engine recorded its own heartbeat.', 'sightings', 'LOT WEATHER DESK', false, true),
  ('coffee-freshness-could-not-be-verified', 'COFFEE FRESHNESS COULD NOT BE VERIFIED', 'Pot at 4:11 a.m. described as more of a posture than a beverage.', 'sightings', 'STAFF / 4:11 A.M.', true, true),
  ('applause-money-not-taxable', 'CORRECTION: APPLAUSE MONEY IS NOT TAXABLE', 'It is also not money. Finance regrets nothing.', 'corrections', 'FINANCE / ACCIDENTALLY', false, true),
  ('room-not-listening-to-you-specifically', 'CORRECTION: THE ROOM IS NOT LISTENING TO YOU SPECIFICALLY', 'It is listening to everyone. You are not unique here.', 'corrections', 'ROOM DESK', true, true),
  ('public-advised-stop-thanking-room', 'PUBLIC ADVISED TO STOP THANKING THE ROOM', 'Repeat: gratitude is being archived. Compliance recommended.', 'notices', 'PUBLIC NOTICE', true, true),
  ('updated-house-rules-wearable-format', 'UPDATED HOUSE RULES NOW AVAILABLE IN WEARABLE FORMAT', 'See: House Rules Tee. Issued, not sold. Effective immediately.', 'notices', 'COMPLIANCE & FELT', true, true),
  ('timing-slip-discovered-inside-motel-bible', 'TIMING SLIP DISCOVERED INSIDE MOTEL BIBLE', 'Slip indicates a quarter-mile run never officially scheduled.', 'notices', 'MOTEL DESK', false, true)
on conflict (slug) do update set
  title = excluded.title,
  body = excluded.body,
  category = excluded.category,
  byline = excluded.byline,
  is_true = excluded.is_true,
  is_public = excluded.is_public;

insert into public.phone_messages (slug, from_label, message_type, body, unlock_level, is_public)
values
  ('omnishift-hr-unclear-active', 'OmniShift HR', 'voicemail', 'Your employment status remains unclear but active. Please continue existing in the room until further notice. — HR', 0, true),
  ('driver-bring-hoodie', 'The Driver', 'voicemail', 'Bring a hoodie next time. The lot gets cold after the bass stops. Do not bring the swan. She will find her own way.', 0, true),
  ('miss-september-silence-feather', 'Miss September', 'voicemail', '[silence, 14 seconds] [a feather is placed on something] [silence, 8 seconds]', 1, true),
  ('711-clerk-hot-dogs-personal', 'The 7/11 Clerk', 'voicemail', 'Hey. The hot dogs been on there too long. I am telling everybody. You I am telling personally. Do not trust them.', 0, true),
  ('room-manager-stop-thanking-room', 'Room Manager', 'voicemail', 'Stop thanking the room. I am asking nicely. I am asking on behalf of the room. The room cannot ask on its own. That is why I am asking.', 0, true),
  ('night-shift-performance-review', 'Night Shift Supervisor', 'voicemail', 'Performance review has been moved to 3:17 a.m. on an unspecified date. You will know it is happening because it will already be happening.', 0, true),
  ('kid-with-the-mop-never-clocked-in', 'Kid With The Mop', 'voicemail', '[mop sound] [mop sound] [pauses] you do not have to clock out if you never clocked in [mop sound]', 0, true)
on conflict (slug) do update set
  from_label = excluded.from_label,
  message_type = excluded.message_type,
  body = excluded.body,
  unlock_level = excluded.unlock_level,
  is_public = excluded.is_public;

insert into public.ventures (slug, name, status, description, memo, is_public)
values
  ('idle-company', 'OmniShift Idle Company', 'announced_by_ai', 'A service where someone sits in your passenger seat for one hour. No conversation. Bring snacks.', 'AI says loneliness has operational upside.', true),
  ('lot-weather', 'Lot Weather', 'pending', 'A forecasting product for parking lot conditions, bass residue, sodium vapor, and whether the lowrider is breathing.', 'Weather team not hired yet. Forecasts continue.', true),
  ('applause-recovery', 'Applause Recovery', 'under_review', 'A finance-adjacent division attempting to classify applause money without admitting applause money exists.', 'Finance cannot reimburse what cannot be itemized.', true)
on conflict (slug) do update set
  name = excluded.name,
  status = excluded.status,
  description = excluded.description,
  memo = excluded.memo,
  is_public = excluded.is_public;

insert into public.secrets (slug, level, clue, payload, is_active)
values
  ('do-not-trust-hot-dogs', 2, 'The clerk told you personally.', '{"route":"/newsstand","query":"hot dogs"}'::jsonb, true),
  ('applause-money', 2, 'Finance regrets nothing.', '{"route":"/newsstand","query":"applause money"}'::jsonb, true),
  ('motel-key-clock', 3, 'The key and the clock know each other.', '{"route":"/room-8","requires":["motel-key-147","wall-clock-147"]}'::jsonb, true)
on conflict (slug) do update set
  level = excluded.level,
  clue = excluded.clue,
  payload = excluded.payload,
  is_active = excluded.is_active;
