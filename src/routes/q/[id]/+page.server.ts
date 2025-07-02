import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!params.id) {
		error(404, 'Finner ikke en kvadd med den ID-en');
	}

	const graph = await locals.db.query.graphs.findFirst({
		where: (graphs, { eq }) => eq(graphs.id, params.id),
		with: {
			points: true
		}
	});

	if (!graph) {
		error(404, 'Finner ikke en kvadd med den ID-en');
	}

	return {
		graph,
		sessionId: locals.session
	};
};
