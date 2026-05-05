insert into public.wall_posts (alias, body, x, y, rotation, is_approved)
values
  ('Rudy 44', 'READY AND WILLING TO MESS IT UP', 72, 18, -4, true),
  ('Eddy Pool', 'THIS ISN’T HELL BUT WE KNOW WHAT IT LOOKS LIKE', 34, 52, 2, true),
  ('No Eddy', 'NO EDDY THE POOL NOT EDDY THE MAN', 42, 38, -6, true),
  ('Lot Arms', 'NO WAR / RACK EM ANYWAY', 68, 40, -8, true),
  ('Reg 3', '573% legal maybe ask the table', 76, 78, 7, true),
  ('Unknown', 'EAT CHILI', 19, 28, -11, true),
  ('Adams', 'ADAMS WAS HERE BUT NOT ENOUGH TO MATTER', 84, 60, 3, true),
  ('Room Hand', 'The wall remembers better than the bartender', 51, 70, -3, true)
on conflict do nothing;
