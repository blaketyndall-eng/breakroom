insert into public.secrets (slug, level, clue, payload, is_active)
values
  ('clocked-out-room-entry', 1, 'The room noticed you came in after the shift ended.', '{"trigger":"visit:/after-hours","artifact_slug":"after-hours-badge","artifact_type":"badge","title":"After Hours Badge","notes":"Issued after the supervisor connection went dark."}'::jsonb, true),
  ('dial-tone-evidence', 1, 'The company phone kept your number without asking.', '{"trigger":"visit:/phone","artifact_slug":"dial-tone-slip","artifact_type":"transmission_slip","title":"Dial Tone Slip","notes":"A receipt from a phone nobody owns."}'::jsonb, true),
  ('night-transmission', 1, 'Channel 1:47 said your name without saying your name.', '{"trigger":"visit:/radio","artifact_slug":"radio-147-station-id","artifact_type":"radio_log","title":"Radio 1:47 Station ID","notes":"Dead air with your fingerprints on it."}'::jsonb, true),
  ('wall-witness', 1, 'The bathroom wall saw you looking.', '{"trigger":"visit:/sign-the-wall","artifact_slug":"bathroom-wall-witness-card","artifact_type":"wall_card","title":"Bathroom Wall Witness Card","notes":"Wood panel memory. Marker smell not included."}'::jsonb, true),
  ('left-a-mark', 2, 'You wrote something short and the wall kept the shape of it.', '{"trigger":"submit:wall_post","artifact_slug":"pending-marker-receipt","artifact_type":"receipt","title":"Pending Marker Receipt","notes":"Visible locally. Waiting for the back office to blink."}'::jsonb, true),
  ('object-file-opened', 2, 'The drawer knows when an object has been handled.', '{"trigger":"visit:/lost-found/[slug]","artifact_slug":"object-evidence-card","artifact_type":"evidence_card","title":"Object Evidence Card","notes":"Filed by the drawer, not by staff."}'::jsonb, true),
  ('issued-goods-file-opened', 2, 'The rack opened a file and pretended it was inventory.', '{"trigger":"visit:/rack/[slug]","artifact_slug":"issued-goods-request","artifact_type":"file_request","title":"Issued Goods Request","notes":"Not a cart. Not a sale. A file request."}'::jsonb, true)
on conflict (slug) do update set
  level = excluded.level,
  clue = excluded.clue,
  payload = excluded.payload,
  is_active = excluded.is_active;
