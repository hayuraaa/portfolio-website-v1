CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`cover_image` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`published_on` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_listing_idx` ON `posts` (`is_published`,`published_on`);