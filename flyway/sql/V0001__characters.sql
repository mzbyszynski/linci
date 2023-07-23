create extension pgcrypto;

create table user (
    id bigserial not null primary key,
    name varchar(256) not null unique,
    email varchar(256) not null unique,
    password text not null
);

create table character (
  id bigserial not null primary key,
  name varchar(255) not null,
  user_id bigint not null references user (id)
);

create index on character (user_id);
