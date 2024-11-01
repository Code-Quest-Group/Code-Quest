CREATE TABLE submissions
(
    submission_id     BIGINT AUTO_INCREMENT NOT NULL,
    user_id           VARCHAR(36)           NULL,
    problem_id        VARCHAR(255)          NOT NULL,
    language          VARCHAR(255)          NULL,
    submission_status VARCHAR(255)          NULL,
    token             VARCHAR(255)          NULL,
    correct_testcases INT                   NULL,
    total_testcases   INT                   NULL,
    error_message     VARCHAR(255)          NULL,
    created_at        datetime              NULL,
    finished_at       datetime              NULL,
    stdout            MEDIUMTEXT            NULL,
    stderr            MEDIUMTEXT            NULL,
    time              FLOAT                 NULL,
    memory            FLOAT                 NULL,
    CONSTRAINT pk_submissions PRIMARY KEY (submission_id)
);

ALTER TABLE submissions
    ADD CONSTRAINT FK_SUBMISSIONS_ON_PROBLEM FOREIGN KEY (problem_id) REFERENCES problems (problem_id);

ALTER TABLE submissions
    ADD CONSTRAINT FK_SUBMISSIONS_ON_USER FOREIGN KEY (user_id) REFERENCES users (user_id);