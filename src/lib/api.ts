import type { Graph } from './db/schemas';

type CreateGraphParams = {
	name: string;
	xLabel: string;
	yLabel: string;
	topEmoji: string;
	rightEmoji: string;
	bottomEmoji: string;
	leftEmoji: string;
	allowMultiplePoints?: boolean;
};

type CreateGraphResponse =
	| {
			success: true;
			graph: Graph;
	  }
	| {
			success?: undefined;
			graph?: undefined;
			error: string;
	  };

export async function createGraph({
	name,
	xLabel,
	yLabel,
	topEmoji,
	rightEmoji,
	bottomEmoji,
	leftEmoji,
	allowMultiplePoints
}: CreateGraphParams): Promise<CreateGraphResponse> {
	const response = await fetch('/api/graph', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			xLabel,
			yLabel,
			topEmoji,
			rightEmoji,
			bottomEmoji,
			leftEmoji,
			allowMultiplePoints
		})
	});

	return await response.json();
}

export async function addPointToGraph(graphId: string, x: number, y: number) {
	const response = await fetch(`/api/graph/${graphId}/points`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ x, y })
	});

	return response.ok;
}
