#!/usr/bin/env bash


source .env

rm -rf src/utils/alembic/versions/*

alembic revision --autogenerate -m "recreate migrations"
alembic upgrade head
