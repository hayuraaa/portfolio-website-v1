CREATE TABLE `certificates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`issuer` text NOT NULL,
	`kind` text NOT NULL,
	`issued_on` text NOT NULL,
	`expires_on` text,
	`credential_id` text,
	`credential_url` text,
	`image` text,
	`skills` text DEFAULT '[]' NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `certificates_listing_idx` ON `certificates` (`is_published`,`issued_on`);