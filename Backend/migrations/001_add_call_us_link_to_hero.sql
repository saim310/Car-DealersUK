-- Migration: Add call_us_link column to hero_settings table
-- Description: Adds a column to store the call us button link/phone number

ALTER TABLE hero_settings 
ADD COLUMN call_us_link VARCHAR(255) DEFAULT '' AFTER images_json;
