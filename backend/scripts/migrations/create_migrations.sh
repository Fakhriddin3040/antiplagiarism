#!/usr/bin/env bash


# Check for util exists
if ! [ -x "$(command -v alembic)" ]; then
  echo 'Error: alembic is not installed.' >&2
  exit 1
fi

alembic revision --autogenerate -m "$1"
