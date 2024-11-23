alter table submissions
    modify submission_id varchar(36) not null;

ALTER TABLE submissions
    modify user_code TEXT NULL;

ALTER TABLE submissions
    modify error_message TEXT NULL;

create index submissions_token_index
    on submissions (token);