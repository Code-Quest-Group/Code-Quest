ALTER TABLE problems
    ADD author_id VARCHAR(255) NULL,
    ADD problem_status VARCHAR(255) NULL;

ALTER TABLE problems
    ADD CONSTRAINT FK_PROBLEMS_ON_USER FOREIGN KEY (author_id) REFERENCES users (user_id);

CREATE INDEX IDX_PROBLEMS_PROBLEM_STATUS ON problems (problem_status);

UPDATE problems
SET problem_status = 'APPROVED'
WHERE problem_status IS NULL;

ALTER TABLE problems
    MODIFY problem_status VARCHAR(255) NOT NULL;