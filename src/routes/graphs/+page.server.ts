import { count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { graphs, points } from '$lib/db/schemas';

export const load: PageServerLoad = async ({ locals }) => {
	const g = await locals.db
		.select({
			id: graphs.id,
			name: graphs.name,
			allowMultiplePoints: graphs.allowMultiplePoints,
			showPoints: graphs.showPoints,
			points: count(points.id)
		})
		.from(graphs)
		.leftJoin(points, eq(points.graphId, graphs.id))
		.where(eq(graphs.sessionId, locals.session))
		.groupBy(graphs.id);

	return {
		graphs: g
	};
};
