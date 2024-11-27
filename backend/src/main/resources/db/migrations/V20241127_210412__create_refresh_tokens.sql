CREATE TABLE refresh_tokens
(
    serial_id          BIGINT AUTO_INCREMENT     NOT NULL,
    user_id     VARCHAR(255)              NOT NULL,
    token       VARCHAR(255)              NOT NULL,
    expiry_date datetime                  NOT NULL,
    CONSTRAINT pk_refresh_tokens PRIMARY KEY (serial_id)
);

ALTER TABLE refresh_tokens
    ADD CONSTRAINT uc_refresh_tokens_token UNIQUE (token);

ALTER TABLE refresh_tokens
    ADD CONSTRAINT uc_refresh_tokens_user UNIQUE (user_id);

ALTER TABLE refresh_tokens
    ADD CONSTRAINT FK_REFRESH_TOKENS_ON_USER FOREIGN KEY (user_id) REFERENCES users (user_id);

ALTER TABLE refresh_tokens
    ADD INDEX idx_token (token);