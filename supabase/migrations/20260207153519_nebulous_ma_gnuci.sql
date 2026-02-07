ALTER TABLE "events" ALTER COLUMN "start_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "end_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "title_uk" text;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "description_uk" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "title_uk" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "content_uk" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "title_uk" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "description_uk" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "location_uk" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "title_uk" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "description_uk" text;--> statement-breakpoint
ALTER TABLE "organisations" ADD COLUMN "name_uk" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "name_uk" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "title_uk" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "description_uk" text;