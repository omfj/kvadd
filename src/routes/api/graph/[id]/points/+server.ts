import { json } from '@sveltejs/kit';
import { points } from '$lib/db/schemas';
import type { RequestHandler } from './$types';

function generateRandomColor(): string {
	const colors = [
		'#ef4444',
		'#f97316',
		'#f59e0b',
		'#eab308',
		'#84cc16',
		'#22c55e',
		'#10b981',
		'#14b8a6',
		'#06b6d4',
		'#0ea5e9',
		'#3b82f6',
		'#6366f1',
		'#8b5cf6',
		'#a855f7',
		'#d946ef',
		'#ec4899',
		'#f43f5e',
		'#dc2626',
		'#ea580c',
		'#d97706'
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

export const POST: RequestHandler = async ({ request, locals, params }) => {
	try {
		const data = (await request.json()) as {
			x: number;
			y: number;
			label: string | null;
		};

		if (!locals.db || !locals.session) {
			return json({ error: 'Database or session not available' }, { status: 500 });
		}

		if (!params.id) {
			return json({ error: 'Graph ID is required' }, { status: 400 });
		}

		const graph = await locals.db.query.graphs.findFirst({
			where: (graphs, { eq, and }) =>
				and(eq(graphs.id, params.id), eq(graphs.sessionId, locals.session))
		});

		if (!graph) {
			return json({ error: 'Graph not found' }, { status: 404 });
		}

		if (!graph.allowMultiplePoints) {
			const existingPoint = await locals.db.query.points.findFirst({
				where: (points, { eq, and }) =>
					and(eq(points.graphId, params.id), eq(points.sessionId, locals.session))
			});

			if (existingPoint) {
				return json(
					{ error: 'Only one point allowed per session for this graph' },
					{ status: 400 }
				);
			}
		}

		const pointData = {
			graphId: params.id,
			x: Math.round(data.x * 1000),
			y: Math.round(data.y * 1000),
			label: data.label || null,
			color: generateRandomColor(),
			sessionId: locals.session
		};

		const result = await locals.db.insert(points).values(pointData).returning();

		return json({
			success: true,
			point: result[0]
		});
	} catch (error) {
		console.error('Error creating point:', error);
		return json({ error: 'Failed to create point' }, { status: 500 });
	}
};
