#!/bin/sh -e

psql --variable=ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE ROLE opensource WITH LOGIN PASSWORD 'opensource';
    CREATE DATABASE "OPENSOURCE-API" OWNER = opensource;
    GRANT ALL PRIVILEGES ON DATABASE "OPENSOURCE-API" TO opensource;
EOSQL
