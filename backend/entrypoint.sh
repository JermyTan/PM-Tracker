#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python pigeonhole/manage.py migrate --no-input
python pigeonhole/manage.py initsuperuser --username="$SUPERUSER" --email="$SUPERUSER_EMAIL" --password="$SUPERUSER_PASSWORD"
python pigeonhole/manage.py collectstatic --no-input --clear

exec "$@"