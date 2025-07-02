import { json } from '@sveltejs/kit';
import { graphs } from '$lib/db/schemas';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const data = (await request.json()) as {
			name: string;
			xLabel?: string | null;
			yLabel?: string | null;
			topEmoji?: string | null;
			rightEmoji?: string | null;
			bottomEmoji?: string | null;
			leftEmoji?: string | null;
			allowMultiplePoints?: boolean;
		};

		if (!locals.db || !locals.session) {
			return json({ error: 'Database or session not available' }, { status: 500 });
		}

		if (!data.name?.trim()) {
			return json({ error: 'Graph name is required' }, { status: 400 });
		}

		const graphData = {
			name: data.name.trim(),
			xLabel: data.xLabel || null,
			yLabel: data.yLabel || null,
			topEmoji: data.topEmoji || null,
			rightEmoji: data.rightEmoji || null,
			bottomEmoji: data.bottomEmoji || null,
			leftEmoji: data.leftEmoji || null,
			allowMultiplePoints: data.allowMultiplePoints ?? true,
			sessionId: locals.session
		};

		const result = await locals.db.insert(graphs).values(graphData).returning();

		return json({
			success: true,
			graph: result[0]
		});
	} catch (error) {
		console.error('Error creating graph:', error);
		return json({ error: 'Failed to create graph' }, { status: 500 });
	}
};
