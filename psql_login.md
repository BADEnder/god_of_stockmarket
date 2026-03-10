After installing Postgresql I did the below steps.

## Open the file pg_hba.conf. For Ubuntu, use for example `/etc/postgresql/13?/main$` `sudo nano pg_hba.conf` and change this line at the bottom of the file, it should be the first line of the settings:

from
-> local   all             postgres                                peer
to
-> local   all             postgres                                trust

## Side note: If you want to be able to connect with other users as well, you also need to change:
from
-> local   all             all                                peer
to (with password)
-> local   all             all                                md5
or (without password)
-> local   all             postgres                           trust

## Restart the server

`sudo service postgresql restart`

## Login into psql and set your password

`psql -U postgres`

`psql -d YOUR_DB_NAME -U my_user`

`ALTER USER postgres WITH PASSWORD '<new_password>';`

- trust - anyone who can connect to the server is authorized to access the database
- peer - use client's operating system user name as database user name to access it.
- md5 - password-base authentication
