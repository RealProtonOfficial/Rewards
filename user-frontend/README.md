# Referral Rewards User Frontend

## Available Scripts

In the project directory, you can run:

### Install

```
$ npm install
```

### Build (for Production)

```
$ npm run build
```

### Run (for Development)

```
$ npm run start
```

### View the User Frontend

http://localhost:3010/


### Register

Register for a new account, then manually update the status of the user account to 'verified':

```
postgres=# \c affiliate_referrals
affiliate_referrals=# update "users" set status = 'verified';
```

### Login

Login using your new accont details to view the user home screen.

### My Refferal Link

Click "My Refferal Link" to see your referral link
Click to copy the link to your clipboard.

### Testing the Affiliate Referral Link

Log out of the current account and access the service using the affiliate referral link.
Click the Register link and create a new account.

Check the database for the new users:

```
affiliate_referrals=# select * from "Users";
```

Check the database for the referral connection:

```
affiliate_referrals=# select * from "Referees";
 id | userId | rLevel1 | rLevel2 | rLevel3 |         createdAt          |         updatedAt
----+--------+---------+---------+---------+----------------------------+----------------------------
  1 |      1 |         |         |         | 2025-05-30 22:19:00.834-06 | 2025-05-30 22:19:00.834-06
  2 |      2 |       1 |         |         | 2025-05-30 22:44:26.053-06 | 2025-05-30 22:44:26.053-06
```

Click on the Referred Affiliates link in the User Home screens to view the referred affiliate.

http://localhost:3010/referred-affiliates

### Rewards

Run the following SQL to create a rewards entry in the database:

```
affiliate_referrals=# insert into "Rewards" ("userId", "referralId", "assetName", "level", "commissionPercentage", "assetAmount", "commissionAmount", "createdAt", "updatedAt") values (1, 1, 'Test Asset', 1, 5, 500, 25, now(), now());
```

Check the `Rewards` table

```
affiliate_referrals=# select * from "Rewards";
```

Click on the "Reward History" link in the User Home screens to view the referral rewards.

http://localhost:3010/reward-history

### Testing the 3 Affiliates Levels

Create a new account using the Affiliate Referal link of the second user.
Then log in using the first account and click on Referred Affiliates to see teh 2 levels of affiliate connections.
Now repeat the process using the referral link of the 3rd account you created to see the 3 levels of affiliate connections.

```
affiliate_referrals=# select * from "Referees";
 id | userId | rLevel1 | rLevel2 | rLevel3 |         createdAt          |         updatedAt
----+--------+---------+---------+---------+----------------------------+----------------------------
  1 |      1 |         |         |         | 2025-05-30 22:19:00.834-06 | 2025-05-30 22:19:00.834-06
  2 |      2 |       1 |         |         | 2025-05-30 22:44:26.053-06 | 2025-05-30 22:44:26.053-06
  3 |      3 |       2 |       1 |         | 2025-05-30 23:11:09.718-06 | 2025-05-30 23:11:09.718-06
  4 |      4 |       3 |       2 |       1 | 2025-05-30 23:18:34.883-06 | 2025-05-30 23:18:34.883-06
```
