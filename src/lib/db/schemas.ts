import { relations, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable as table, text, integer } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const graphs = table('graphs', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text().notNull(),
	xLabel: text(),
	x2Label: text(),
	yLabel: text(),
	y2Label: text(),
	topEmoji: text(),
	rightEmoji: text(),
	bottomEmoji: text(),
	leftEmoji: text(),
	allowMultiplePoints: integer({ mode: 'boolean' }).notNull().default(true),
	showPoints: integer({ mode: 'boolean' }).notNull().default(true),
	createdAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date()),
	sessionId: text()
		.notNull()
		.references(() => sessions.id, {
			onDelete: 'cascade'
		})
});

export type Graph = InferSelectModel<typeof graphs>;

export const graphsRelations = relations(graphs, ({ one, many }) => ({
	session: one(sessions, {
		fields: [graphs.sessionId],
		references: [sessions.id]
	}),
	points: many(points)
}));

export const points = table('points', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	graphId: text()
		.notNull()
		.references(() => graphs.id, {
			onDelete: 'cascade'
		}),
	x: integer().notNull(),
	y: integer().notNull(),
	label: text(),
	color: text().notNull(),
	sessionId: text()
		.notNull()
		.references(() => sessions.id, {
			onDelete: 'cascade'
		}),
	createdAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const pointsRelations = relations(points, ({ one }) => ({
	graph: one(graphs, {
		fields: [points.graphId],
		references: [graphs.id]
	}),
	session: one(sessions, {
		fields: [points.sessionId],
		references: [sessions.id]
	})
}));

export type Point = InferSelectModel<typeof points>;

export const sessions = table('sessions', {
	id: text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	createdAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const sessionsRelations = relations(sessions, ({ many }) => ({
	graphs: many(graphs),
	points: many(points)
}));
