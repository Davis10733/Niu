# Niu 

`Niu` is a project that using IPFS to create total decentralized community. In here, you can join the topic you're 
interested and free to speak out you opinon. 

# Pre-installation
* docker-compose installed

# Installation

`yarn dev`

# API 

## User related
### user register
> register a new user of Niu

#### Method
#### POST 

**Request Body**
```JavaScript
{
  "username": "your user name",
  "password": "your password",
  "email": "your email address"
}
```
**Response Body**
```JavaScript
{
  "message": "success",
}
```

### user login
> you'll get a jwt token for other Niu API

#### Method
#### POST 

**Request Body**
```JavaScript
{
  "username": "your user name",
  "password": "your password",
}
```
**Response Body**
```JavaScript
{
  "jwt": "your jwt",
  "message": "success",
}
```
