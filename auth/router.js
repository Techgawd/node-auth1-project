const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("../users/user-model");

router.post("/register", (req, res) => {
    const userInfo = req.body;

    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

    userInfo.password = hash;

  Users.add(userInfo)
    .then(user => {
      res.json(user);
    })
    .catch(err => res.send(err));
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    Users.findBy({ username })
     .then(([user]) => {
         if(user && bcrypt.compareSync(password, user.password)) {
            req.session.loggedIn = true;
            res.status(200).json({ hello: user.username });
         } else {
             res.status(401).json({ errorMessage: "invalid credentials"})
         }
     })
     .catch(error => {
         res.status(500).json({ errorMessage:"error finding the user"})
     })
});

router.get("/logout", (req, res) => {
    console.log('logout endpoint')
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.json({ message: 'Sorry, you can not leave' })
        } else {
          res.json({ message: 'good bye' })
        }
      })
    }
  })

module.exports = router;
