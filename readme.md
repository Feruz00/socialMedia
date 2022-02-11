# Social Media application

Built using modern tehnologies: node.js, express.js, mongoDB(mongoose), react and socket.io

# Features
* React
* Express.js
* MongoDB(mongoose)
* Socket.io

# Getting started
* Clone the repository
```
https://github.com/Feruz00/socialMedia.git <project_name>
```
* Install dependencies
```
cd <project_name>
cd client/
yarn # or npm i
cd ..
cd server/
yarn # or npm i
```
* Setup environment variables

```
cd server/
touch .env 
```
Following are the environment variables:
`FRONTEND_URL` - Frontend url <br />
`SESSION_SECRET` - Secret for `express-session` <br />
`MONGO_URL` - is the MongoDB connection string, for e.g. `MONGO_URL=mongodb://localhost:27017/socialMedia` <br />
`GOOGLE_CLIENT_ID` , `GOOGLE_CLIENT_SECRET` - fill up [Cloud Google](https://console.cloud.google.com/) <br />
 `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - fill up [Github](https://github.com) <br />
`USER_ADDRESS`, `USER_PASSWORD` - for gmail account send tokens when user registered or reset password to confirm email <br />
`my_secret` - it is simple your secret <br />

*Run the project locally for development
Open two terminal
```
cd client/
npm start
```

```
cd server/
nodemon app.js
```
