import { createDatabase } from '$lib/db/drizzle';
import { sessions } from '$lib/db/schemas';
import { nanoid } from 'nanoid';

export const handle = async ({ event, resolve }) => {
	const d1 = event.platform!.env.DB;

	const db = createDatabase(d1);
	event.locals.db = db;

	let sessionId = event.cookies.get('__session');

	if (sessionId) {
		const session = await db.query.sessions.findFirst({
			where: (sessions, { eq }) => eq(sessions.id, sessionId!)
		});
		if (!session) {
			sessionId = nanoid();
			await db.insert(sessions).values({ id: sessionId });
			event.cookies.set('__session', sessionId, { path: '/', httpOnly: true });
		}
	} else {
		sessionId = nanoid();
		await db.insert(sessions).values({ id: sessionId });
		event.cookies.set('__session', sessionId, { path: '/', httpOnly: true });
	}

	event.locals.session = sessionId;

	return await resolve(event);
};
