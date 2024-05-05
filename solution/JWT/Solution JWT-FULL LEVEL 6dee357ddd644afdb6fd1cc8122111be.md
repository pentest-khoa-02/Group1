# Solution JWT-FULL LEVEL

This web has three level  in JWT handling bug : `easy`-`medium`-`hard`

First , we access to **easy** level 

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled.png)

After we have successfully logged , it will be granted a token 

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%201.png)

And when we decode it with `JWT Editor`  , it will look like this  :

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%202.png)

ok ⇒  Looking at it , we see token is signed with `H2556` algorithm . For those who don’t know , `H256` is symmetric algorithm , it uses one single secret key to both encryption and decryption . Next , we pay attention to payload part , there are two parameters we need to consider : `id` and `username`

And because token uses symmetric algorithm , I try to guess secret key  used to sign and verify token .

Here, i will use the `Hashcat` tool to do work that . 

We  need to prepare a token valid and wordlist to brute force , i will save the token in a file called `token.txt` and wordlist is `jwt.secrets.list`  

```jsx
hashcat -a 0 -m 16500 <jwt> <wordlist>
```

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%203.png)

OK , we have got secret key ⇒ an now generate  other valid token by secret key 

```jsx
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJ0cm9uZ2R6IiwiaWF0IjoxNzE0OTE5MzAwLCJleHAiOjE3MTUzNTEzMDB9.QHMgzOZMxOE8lJCwkUmf7q2kXR_LLUROypTDnZkxT0w
```

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%204.png)

Level 2 :  `Medium` 

Decoding token is granted by level medium : 

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%205.png)

Let’s see the difference ⇒ and I see  the token is signed by asymmetric algorithm as `RS256`

That algorithm uses one key pair follow : public key and private key , private key is used to signed token and public key is used to verify . 

For asymmetric algorithm , i try to inject `jku` header parameter , `Jku` parameter is used to represent a public key ( that key which will be used for verification) 

Example a public key represent a object as `JWK` : 

```jsx
{
    "kty": "RSA",
    "e": "AQAB",
    "kid": "884cb87b-d0c4-41e0-ab34-5d945855b43e",
    "n": "iQs5YpJYRdcS2CaU91XkjbeM66Rd5lmvQPTmniy-aTvZcRIS-I-hrlkYH0e2bNew0J-Q6dVGpQgC0Zfddiq8ANuiaa9DOt86_pAitJ97aA2kVYCRTYXNn1ZMEsUcK8q4W07ewoEO3bU01rKWIAkQ9HpK6JsIHToopeuMTg736HnVmLZcVl7Dm5ApubE-SRJZp6vRh4EkJIlVJBJEQkC2D6Qvv9CikWByFmSELHoFZw7mmLhKvo-1KztHqc_2F6Sl9fLFr1zlwy6hAjUXJ2CLGR56DduV96nmRkzQeN3ychTa1VgCE3XAYUf20GTmrwEjD_juVcLK3DwNYEYNwJIYKw"
}
```

Frist we check  to see that server sent request out or not  ? 

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%206.png)

Here , i use `Burp Collborator` to listening a connection

 

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%207.png)

We confirmed server make a request to other server and  next i prepare a key-pair to sign and a server to store it .

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%208.png)

Generate a pair of key with `JWT editor`  and copy public with JWK and store it on your-server.

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%209.png)

And sign a token with private key 

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%2010.png)

⇒ BUMPP 

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%2011.png)

LEVEL 3 : `HARD` 

Decoding token is granted by level Hard 

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%2012.png)

OK, let’s see it , go back the symmetric encryption algorithm `H256`

May be path traversal via kid parameter ? 

Kid = key id represent a  identifier for a key  ( secret key or public key ) , in situation that reference a secret key

Generate a empty secret key (null in base64-encode is `AA==`)  

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%2013.png)

Let try :  `../../../../../../../../dev/null` 

![Untitled](Solution%20JWT-FULL%20LEVEL%206dee357ddd644afdb6fd1cc8122111be/Untitled%2014.png)