const server = require('./server');
const session = require('express-session');
const userRouter = require("./users/user-router");
const authRouter = require('./auth/router')
const restricted = require("./auth/restricted-middleware")

const sessionConfig = {
    name: "Cookie Monster",
    secret: "Keep it secret",
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, 
      httpOnly: true,
    },
    resave:false,
    saveUninitialized: true,
  };
  
server.use(session(sessionConfig))

server.use("/api/users", restricted, userRouter);
server.use("/api/auth", authRouter);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
