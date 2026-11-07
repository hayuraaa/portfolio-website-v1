ALTER TABLE `projects` ADD `publication_url` text;--> statement-breakpoint
UPDATE `projects` SET `category` = 'AI & Data' WHERE `category` IN ('Machine Learning', 'Data Analysis');
