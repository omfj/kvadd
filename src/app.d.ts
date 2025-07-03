// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}

		interface Locals {
			db: import('$lib/db/drizzle').Database;
			session: string;
			graphUpdate: import('$lib/api').GraphUpdateBroadcaster;
		}
	}
}

export {};
