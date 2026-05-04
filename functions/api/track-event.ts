export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  const body = await request.json().catch(() => ({}));
  return Response.json({ ok: true, received: body, note: 'Wire this to Supabase service role in Sprint 2.' });
}
