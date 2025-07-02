CREATE TABLE `graphs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`x_label` text,
	`y_label` text,
	`top_emoji` text,
	`right_emoji` text,
	`bottom_emoji` text,
	`left_emoji` text,
	`allow_multiple_points` integer DEFAULT true NOT NULL,
	`session_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `points` (
	`id` text PRIMARY KEY NOT NULL,
	`graph_id` text NOT NULL,
	`x` integer NOT NULL,
	`y` integer NOT NULL,
	`label` text,
	`color` text NOT NULL,
	`session_id` text NOT NULL,
	FOREIGN KEY (`graph_id`) REFERENCES `graphs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL
);
