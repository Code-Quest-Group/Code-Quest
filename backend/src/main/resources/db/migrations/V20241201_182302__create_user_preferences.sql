CREATE TABLE user_preferences
(
    user_id             VARCHAR(255) NOT NULL,
    dark_mode           TINYINT(1)   NOT NULL,
    is_profile_public   TINYINT(1)   NOT NULL,
    language            VARCHAR(255) NOT NULL,
    timezone            VARCHAR(255) NOT NULL,
    CONSTRAINT pk_user_preferences PRIMARY KEY (user_id)
);

ALTER TABLE user_preferences
    ADD CONSTRAINT FK_USER_PREFERENCES_ON_USER FOREIGN KEY (user_id) REFERENCES users (user_id);