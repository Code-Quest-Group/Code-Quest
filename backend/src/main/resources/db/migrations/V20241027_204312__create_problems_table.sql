create table problems
(
    problem_id          varchar(255) not null,
    name                varchar(255) not null,
    description         text not null,
    supported_languages varchar(255),
    input_format        varchar(255) not null,
    code_template       text         not null,
    test_cases          text         not null,
    expected_result     text         not null,
    primary key (problem_id)
)