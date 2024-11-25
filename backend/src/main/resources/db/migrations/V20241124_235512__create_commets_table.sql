CREATE TABLE comments
(
    comment_id VARCHAR(255) NOT NULL,
    user_id    VARCHAR(255) NOT NULL,
    problem_id VARCHAR(255) NOT NULL,
    author     VARCHAR(255) NOT NULL,
    content    TEXT         NOT NULL,
    created_at datetime     NOT NULL,
    CONSTRAINT pk_comments PRIMARY KEY (comment_id)
);

ALTER TABLE comments
    ADD CONSTRAINT FK_COMMENTS_ON_PROBLEM FOREIGN KEY (problem_id) REFERENCES problems (problem_id);

ALTER TABLE comments
    ADD CONSTRAINT FK_COMMENTS_ON_USER FOREIGN KEY (user_id) REFERENCES users (user_id);