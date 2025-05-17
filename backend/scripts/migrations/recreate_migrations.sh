#!/usr/bin/env bash


source .env

echo "Removing migrations from {$MIGRATIONS_PATH}"

rm $MIGRATIONS_PATH/*

alembic revision --autogenerate -m "recreate migrations"
