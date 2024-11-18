CREATE TABLE code_templates
(
    id                 BIGINT AUTO_INCREMENT NOT NULL,
    problem_id         VARCHAR(255)          NOT NULL,
    language           VARCHAR(255)          NOT NULL,
    template_type      VARCHAR(255)          NOT NULL,
    code               TEXT                  NOT NULL,
    CONSTRAINT pk_code_templates PRIMARY KEY (id)
);

ALTER TABLE code_templates
    ADD CONSTRAINT unique_problem_id_language_template_type UNIQUE (problem_id, language, template_type);