DELETE FROM submissions
WHERE submissions.user_id IS NULL;

ALTER TABLE submissions
    MODIFY user_id varchar(36) NOT NULL;

ALTER TABLE submissions
    ADD user_code VARCHAR(255) NULL;
