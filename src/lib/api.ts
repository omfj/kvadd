import type { Graph } from './db/schemas';

type CreateGraphParams = {
	name: string;
	xLabel: string;
	x2Label: string;
	yLabel: string;
	y2Label: string;
	topEmoji: string;
	rightEmoji: string;
	bottomEmoji: string;
	leftEmoji: string;
	allowMultiplePoints?: boolean;
	showPoints?: boolean;
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
	x2Label,
	yLabel,
	y2Label,
	topEmoji,
	rightEmoji,
	bottomEmoji,
	leftEmoji,
	allowMultiplePoints,
	showPoints
}: CreateGraphParams): Promise<CreateGraphResponse> {
	const response = await fetch('/api/graph', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			xLabel,
			x2Label,
			yLabel,
			y2Label,
			topEmoji,
			rightEmoji,
			bottomEmoji,
			leftEmoji,
			allowMultiplePoints,
			showPoints
		})
	});

	return await response.json();
}

export async function addPointToGraph(
	graphId: string,
	x: number,
	y: number,
	label: string | null = null
) {
	const response = await fetch(`/api/graph/${graphId}/points`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ x, y, label })
	});

	return response.ok;
}

type UpdateGraphParams = {
	name?: string;
	showPoints?: boolean;
	allowMultiplePoints?: boolean;
};

type UpdateGraphResponse =
	| {
			success: true;
			graph: Graph;
	  }
	| {
			success?: undefined;
			graph?: undefined;
			error: string;
	  };

export async function updateGraph(
	graphId: string,
	params: UpdateGraphParams
): Promise<UpdateGraphResponse> {
	const response = await fetch(`/api/graph/${graphId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(params)
	});

	return await response.json();
}

export class GraphUpdateBroadcaster {
	#url: string;
	#apiKey: string;

	constructor(url: string, apiKey: string) {
		this.#url = url;
		this.#apiKey = apiKey;
	}

	async broadcastToGraph(id: string) {
		const url = new URL(this.#url);
		url.pathname = `/graph/${id}`;

		try {
			await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					Authorization: `Bearer ${this.#apiKey}`
				}
			});
		} catch {
			console.error(`Failed to broadcast graph change for: ${id}`);
		}
	}
}
