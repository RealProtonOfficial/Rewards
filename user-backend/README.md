# Affiliate Referral Rewards User Backend

## Run `npm install` to install the packages

```
$ npm install
```

## Set up the PostgreSQL Database

### Install PostgreSQL

First, it is always a good idea to download information about all packages available for installation from your configured sources before the actual installation.

```
$ sudo apt update
```

Now is the time to do the actual PostgreSQL installation. This will install the latest PostgreSQL version along with the newest extensions and additions that are not yet officially part of the PostgreSQL core.

```
$ sudo apt install postgresql postgresql-contrib
```

Command to check the status of PostgresSQL

```
$ service postgresql status
```

Connect to the PostgreSQL database (on Linux)

```
$ sudo -u postgres psql
```

Connect to a PostgreSQL database

```
$ psql -U <username> -d <database_name>
$ psql -U postgres -d affiliate_referrals
```

Connect to a PostgreSQL database (on Windows)

```
H:\opt\PostgreSQL\16\bin\psql.exe -U postgres
```

Check the connection

```
postgres=# \conninfo
You are connected to database "postgres" as user "postgres" via socket in "/var/run/postgresql" at port "5432".
```

List the databases

```
postgres=# \l
You are connected to database "postgres" as user "postgres" via socket in "/var/run/postgresql" at port "5432".
```

To see a list of users and their privileges use `\du`

```
postgres=# \du
```

The default “postgres” user does not have a password. Set it using the following command.

```
postgres=# \password postgres
```

Create the `affiliate_referrals` database

```
postgres=# CREATE DATABASE affiliate_referrals;
```

Run `npm run migrate` to create the database structure

```
$ npm run migrate
```

Show databases

```
postgres=# \l
```

Connect to this `affiliate_referrals` database

```
postgres=# \c affiliate_referrals
```

Show database tables

```
affiliate_referrals=# \dt
                List of relations
 Schema |        Name         | Type  |  Owner
--------+---------------------+-------+----------
 public | Referees            | table | postgres
 public | ReferralManagements | table | postgres
 public | Rewards             | table | postgres
 public | SequelizeMeta       | table | postgres
 public | Users               | table | postgres
(5 rows)
```

Show table information

```
$ \dt+ "Users"
```

Show table structure

```
$ \d "Users"
```


## Start the ExpressJS NodeJS Server Application

```
$ npm run start
```


## Sanity checks

- http://localhost:3001/v1/ping
- http://localhost:3001/v1/user/referralLink



## Running on Windows

### Install Windows Subsystem for Linux

Enable Windows Subsystem for Linux

````
C:\WINDOWS\system32> Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
````

List distributions
````
C:\WINDOWS\system32> wsl --list
Windows Subsystem for Linux Distributions:
Ubuntu (Default)
````

### Start Ubuntu Linux on Windows

````
C:\WINDOWS\system32> wsl -d Ubuntu
Please enable the Virtual Machine Platform Windows feature and ensure virtualization is enabled in the BIOS.
For information please visit https://aka.ms/wsl2-install
````

### Stop Ubuntu on Windows

```
$ wsl --terminate Ubuntu
```

### Install Redis on Ubuntu Linux

- <https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04>


### Check if Redis is installed

```
$ sudo systemctl status redis
```

### Check if Redis is running

```
root@DESKTOP:/mnt/c/Users/user# redis-cli
Could not connect to Redis at 127.0.0.1:6379: Connection refused
not connected> quit
```

### First, update your local Apt cache

```
$ sudo apt update
```

### Install Redis Server

```
$ sudo apt install redis-server
```

### Update the Redis config for Ubuntu

````
$ sudo vi /etc/redis/redis.conf
````

Change `supervised no` to `supervised systemd`

### Start/restart the Redis service

```
$ sudo systemctl restart redis.service
```

### Use the redis-cli to test Redis

```
$ redis-cli
127.0.0.1:6379> ping
PONG
```

### Start Redis on Windows Example

```
root@DESKTOP:/mnt/c/WINDOWS/system32# redis-server --daemonize yes
157:C 09 Dec 2024 10:37:53.927 # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
root@DESKTOP:/mnt/c/Users/user# sysctl vm.overcommit_memory=1
vm.overcommit_memory = 1
root@DESKTOP:/mnt/c/Users/user# redis-server --daemonize yes
root@DESKTOP:/mnt/c/Users/user# redis-cli
127.0.0.1:6379> KEYS *
(empty array)
```

### Check what's in the Redis storage

```
127.0.0.1:6379> KEYS *
1) "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVibGljQWRkcmVzcyI6bnVsbCwiZW1haWwiOiJkZG9oZXJ0eUByZWFsc3BsaXQubmV0IiwiaWF0IjoxNzMzNzYzNTk1LCJleHAiOjE3MzM4NDk5OTV9.Q-4HnIatH7A_eW8noniAiuy4KrpSdZQx-_-pwqQfApY"
```
