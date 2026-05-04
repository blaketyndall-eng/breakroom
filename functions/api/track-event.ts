export async function onRequestPost({ request }: { request: Request }) {
  const body = await request.json().catch(() => ({}));
  return Response.json({ ok: true, received: body, stamped: '1:47' });
}
