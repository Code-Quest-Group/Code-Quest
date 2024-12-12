CREATE TABLE submission_logs
(
    submission_id   VARCHAR(255) NOT NULL,
    user_id         VARCHAR(255) NOT NULL,
    token           VARCHAR(255) NOT NULL,
    submission_type VARCHAR(255) NOT NULL,
    created_at      datetime     NOT NULL
);

ALTER TABLE submission_logs
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id);