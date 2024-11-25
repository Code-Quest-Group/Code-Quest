CREATE TABLE problem_ratings
(
    user_id    VARCHAR(255) NOT NULL,
    problem_id VARCHAR(255) NOT NULL,
    rating     DOUBLE          NOT NULL,
    CONSTRAINT pk_problemrating PRIMARY KEY (user_id, problem_id)
);

ALTER TABLE problem_ratings
    ADD CONSTRAINT FK_PROBLEMRATING_ON_PROBLEM FOREIGN KEY (problem_id) REFERENCES problems (problem_id);

ALTER TABLE problem_ratings
    ADD CONSTRAINT FK_PROBLEMRATING_ON_USER FOREIGN KEY (user_id) REFERENCES users (user_id);
