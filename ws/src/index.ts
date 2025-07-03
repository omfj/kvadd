import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

export class WebSocketRoom {
	private connections = new Set<WebSocket>();

	async fetch(request: Request): Promise<Response> {
		if (request.method === 'POST') {
			console.log('Broadcasting to clients');

			this.connections.forEach((connection) => {
				if (connection.readyState === WebSocket.OPEN) {
					connection.send('UPDATE');
				}
			});

			return new Response('OK');
		}

		if (request.headers.get('upgrade') !== 'websocket') {
			return new Response('Expected websocket', { status: 400 });
		}

		const { 0: client, 1: server } = new WebSocketPair();
		server.accept();
		this.connections.add(server);

		server.addEventListener('close', () => {
			this.connections.delete(server);
		});

		return new Response(null, {
			status: 101,
			webSocket: client
		});
	}
}

const app = new Hono<{
	Bindings: CloudflareBindings & { WEBSOCKET_ROOM: DurableObjectNamespace };
}>();

app.use(logger());
app.use(
	cors({
		origin: ['kvadd.omfj.no', 'localhost:5173'],
		credentials: true,
		allowMethods: ['GET', 'POST'],
		allowHeaders: ['Authorization']
	})
);

app.get('/graph/:id', async (c) => {
	const id = c.req.param('id');
	const sessionId = c.req.query('session');
	if (!sessionId) {
		console.error('Session not found');
		return c.json(
			{
				message: 'Missing sessionId'
			},
			403
		);
	}

	const session = await c.env.DB.prepare('SELECT * FROM sessions WHERE id = ?')
		.bind(sessionId)
		.first();

	if (!session) {
		console.error('Session not found');
		return c.json(
			{
				message: 'Invalid session'
			},
			403
		);
	}

	const graph = await c.env.DB.prepare('SELECT * FROM graphs WHERE id = ?').bind(id).first();

	if (!graph) {
		console.error('Graph not found');
		return c.json(
			{
				message: 'Graph does not exist'
			},
			404
		);
	}

	const durableObjectId = c.env.WEBSOCKET_ROOM.idFromName(id);
	const durableObject = c.env.WEBSOCKET_ROOM.get(durableObjectId);

	return durableObject.fetch(c.req.raw);
});

app.post('/graph/:id', async (c) => {
	const id = c.req.param('id');
	const apiKey = c.req.header('Authorization');

	if (`Bearer ${c.env.API_KEY}` !== apiKey) {
		console.error('Wrong API KEY');
		return c.json(
			{
				message: 'Not allowed'
			},
			403
		);
	}

	const graph = await c.env.DB.prepare('SELECT * FROM graphs WHERE id = ?').bind(id).first();

	if (!graph) {
		console.error('Graph not found');
		return c.json(
			{
				message: 'Graph does not exist'
			},
			404
		);
	}

	const durableObjectId = c.env.WEBSOCKET_ROOM.idFromName(id);
	const durableObject = c.env.WEBSOCKET_ROOM.get(durableObjectId);

	return durableObject.fetch(c.req.raw);
});

export default app;
