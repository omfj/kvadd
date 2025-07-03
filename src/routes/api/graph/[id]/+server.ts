import { json } from '@sveltejs/kit';
import { graphs } from '$lib/db/schemas';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
	try {
		const data = (await request.json()) as {
			name?: string;
			showPoints?: boolean;
			allowMultiplePoints?: boolean;
		};

		if (!locals.db || !locals.session) {
			console.error('No session found');
			return json({ error: 'Database or session not available' }, { status: 500 });
		}

		const graphId = params.id;
		if (!graphId) {
			console.error('Graph id is required');
			return json({ error: 'Graph ID is required' }, { status: 400 });
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const updateData: any = {};
		if (data.name !== undefined) {
			if (!data.name.trim()) {
				console.error('Graph data cant be empty');
				return json({ error: 'Graph name cannot be empty' }, { status: 400 });
			}
			updateData.name = data.name.trim();
		}
		if (data.showPoints !== undefined) {
			updateData.showPoints = data.showPoints;
		}
		if (data.allowMultiplePoints !== undefined) {
			updateData.allowMultiplePoints = data.allowMultiplePoints;
		}

		const result = await locals.db
			.update(graphs)
			.set(updateData)
			.where(eq(graphs.id, graphId))
			.returning();

		if (result.length === 0) {
			console.error('Failed to create graph');
			return json({ error: 'Graph not found' }, { status: 404 });
		}

		await locals.graphUpdate.broadcastToGraph(params.id);

		return json({
			success: true,
			graph: result[0]
		});
	} catch (error) {
		console.error('Error updating graph:', error);
		return json({ error: 'Failed to update graph' }, { status: 500 });
	}
};
