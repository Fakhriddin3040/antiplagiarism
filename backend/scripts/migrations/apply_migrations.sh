#!/usr/bin/env bash


if ! [ -x "$(command -v alembic)" ]; then
  echo 'Error: python is not installed.' >&2
  exit 1
fi

alembic upgrade head
