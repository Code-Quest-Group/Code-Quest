CREATE TABLE user_problem_attempts
(
    serial_id            BIGINT AUTO_INCREMENT NOT NULL,
    user_id              VARCHAR(36)           NOT NULL,
    problem_id           VARCHAR(255)          NOT NULL,
    status               VARCHAR(255)          NOT NULL,
    submission_count     INT    DEFAULT 0,
    last_submission_time datetime              NULL,
    CONSTRAINT pk_user_problem_attempts PRIMARY KEY (serial_id)
);

ALTER TABLE user_problem_attempts
    ADD CONSTRAINT FK_USER_PROBLEM_ATTEMPTS_ON_PROBLEM FOREIGN KEY (problem_id) REFERENCES problems (problem_id);

ALTER TABLE user_problem_attempts
    ADD CONSTRAINT FK_USER_PROBLEM_ATTEMPTS_ON_USER FOREIGN KEY (user_id) REFERENCES users (user_id);

ALTER TABLE user_problem_attempts
    ADD CONSTRAINT unique_user_id_problem_id UNIQUE (user_id, problem_id);