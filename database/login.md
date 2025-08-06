After installing Postgresql I did the below steps.

Open the file pg_hba.conf. For Ubuntu, use for example /etc/postgresql/13/main$ sudo nano pg_hba.conf and change this line at the bottom of the file, it should be the first line of the settings:

local   all             postgres                                peer
to

local   all             postgres                                trust
Side note: If you want to be able to connect with other users as well, you also need to change:

local   all             all                                peer
to

local   all             all                                md5
If you used nano editor, exit with double Escape, x, y, Enter to save the config file.

Restart the server

 $ sudo service postgresql restart
Output: * Restarting PostgreSQL 13 database server

Login into psql and set your password

 $ psql -U postgres
 db> ALTER USER postgres with password 'your-pass';
Output: ALTER ROLE

Side note: If you have other users, they will need a password as well:

 db> ALTER USER my_user with password 'your-pass';
Then enter:

 exit
Finally change the pg_hba.conf from

local   all             postgres                                trust
to

local   all             postgres                                md5
Restart the server again

 $ sudo service postgresql restart
Output: * Restarting PostgreSQL 13 database server

Login at psql with postgres user

After restarting the postgresql server, the postgres user accepts the password that you chose:

 psql -U postgres
Output:
Password for user postgres:

psql (13.4 (Ubuntu 13.4-1.pgdg20.04+1))

Type "help" for help.

And you are in psql:

postgres=#

Side note: Same now works for my_user if you added the user and password:

 psql -d YOUR_DB_NAME -U my_user
Which will ask you for the new password of my_user.

Authentication methods details:

trust - anyone who can connect to the server is authorized to access the database

peer - use client's operating system user name as database user name to access it.

md5 - password-base authentication

for further reference check here