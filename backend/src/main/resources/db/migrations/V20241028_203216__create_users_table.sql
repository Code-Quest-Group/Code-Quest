CREATE TABLE users
(
    user_id       VARCHAR(36)  NOT NULL,
    username      VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    country       VARCHAR(255) NOT NULL,
    created_at    datetime     NOT NULL,
    last_login    datetime     NULL,
    CONSTRAINT pk_users PRIMARY KEY (user_id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uc_users_username UNIQUE (username);


ALTER TABLE users
    ADD INDEX idx_username (username),
    ADD INDEX idx_email (email);