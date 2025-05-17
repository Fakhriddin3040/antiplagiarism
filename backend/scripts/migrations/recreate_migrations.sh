#!/usr/bin/env bash


source .env

rm "${MIGRATIONS_PATH}/*"

alembic revision --autogenerate -m "recreate migrations"
