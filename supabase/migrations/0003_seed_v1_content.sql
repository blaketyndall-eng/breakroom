insert into public.tournaments (slug, name, subtitle, subline, cash_pot_cents, location_note)
values ('idle-hands-invitational', 'Idle Hands Invitational', 'Old School Pool Tournament Page', 'Race to 7. Cash only. Clock optional.', 2000, 'Hidden behind the Clock Out gate')
on conflict (slug) do nothing;

insert into public.secrets (slug, name, trigger_type, trigger_value, unlock_type, unlock_payload, hint)
values
('room-8-teaser', 'Room 8 Teaser', 'object_combination', 'motel-key-no-8+wall-clock', 'page', '{"path":"/room-8"}', 'The key and the clock know each other.'),
('miss-september-message', 'Miss September Message', 'search_phrase', 'miss september', 'phone_message', '{"caller":"Miss September"}', 'She was not driving.'),
('hotdog-warning', 'Hot Dog Warning', 'search_phrase', 'do not trust hot dogs', 'news_item', '{"path":"/newsstand"}', 'The clerk told you personally.')
on conflict (slug) do nothing;
