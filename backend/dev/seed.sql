INSERT INTO
    "account" ("id", "username", "password")
VALUES
    (
        '5b9919d6-b4e4-4ddf-84ab-4ea7881c2c87',
        'ricky@gmail.com',
        '$2b$04$ogK9wjam4y8wFII9BZWd7./qWpuUyrcd6rkuNWp6xIhvvAf7hu3gW'
    );

INSERT INTO
    "user" ("name", "email", "accountId")
VALUES
    (
        'Ricky Granger',
        'ricky@gmail.com',
        '5b9919d6-b4e4-4ddf-84ab-4ea7881c2c87'
    );

INSERT INTO
    "account" ("id", "username", "password")
VALUES
    (
        'a2fb248d-f725-44c0-aec2-e4cc3a9a4b5f',
        'thomas@gmail.com',
        '$2b$04$ogK9wjam4y8wFII9BZWd7./qWpuUyrcd6rkuNWp6xIhvvAf7hu3gW'
    );

INSERT INTO
    "user" ("name", "email", "accountId")
VALUES
    (
        'Thomas Pickle',
        'thomas@gmail.com',
        'a2fb248d-f725-44c0-aec2-e4cc3a9a4b5f'
    );

INSERT INTO
    "account" ("id", "username", "password")
VALUES
    (
        '17df79e8-a0b6-4629-a8cc-381999d1cc65',
        'jeremy@gmail.com',
        '$2b$04$ogK9wjam4y8wFII9BZWd7./qWpuUyrcd6rkuNWp6xIhvvAf7hu3gW'
    );

INSERT INTO
    "user" ("name", "email", "accountId")
VALUES
    (
        'Jeremy Fox',
        'jeremy@gmail.com',
        '17df79e8-a0b6-4629-a8cc-381999d1cc65'
    );

SELECT
    *
FROM
    account;