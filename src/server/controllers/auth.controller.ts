import config from "../config/auth.config"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import user from "../../models/user"

// import Database from "better-sqlite3";
// const db = new Database("cq.db", { verbose: console.log });

// const stmt = db.prepare("SELECT * FROM users Where login = ?");

// const controller = {} as any

// @ts-ignore
// controller.changePassword = (req, res) => {
//   //let user = stmt.get(req.body.login);
//   const userData  = user.getUserBy('login', req.body.login)
  
//   if (!userData) {
//     return res.status(404).send({ message: "User Not found." });
//   }
//   const passwordIsValid = bcrypt.compareSync(req.body.password, userData.password);
//   if (!passwordIsValid) {
//     return res.status(401).send({
//       accessToken: null,
//       message: "Неправильный пароль!",
//     });
//   }
//   let update = db.prepare("UPDATE users SET password = ? WHERE login = ?");
//   update.run(bcrypt.hashSync(req.body.newPassword, 8), req.body.username);
//   res.status(200).send({
//     username: user.username,
//     message: "Update Success",
//   });
// };

const controller = {
  // @ts-ignore
  auth: (req, res) => {
    if (!req.body.token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }
    // @ts-ignore
    jwt.verify(req.body.token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        })
      } else {
        user
        .getUserBy('login', decoded.login)
        .then((userData) => {
          const passwordIsValid = bcrypt.compareSync(decoded.password, userData.password);
        
          if (passwordIsValid) {
            res.status(200).send({
              login: decoded.login,
              message: "Auth Success",
            })
            console.log(decoded);
            console.log(decoded.login, "Auth Success");
          } else {
            res.status(401).send({
              message: "Unauthorized!",
            })
          }
        })
      }
    })
  },
  // @ts-ignore
  signup: (req, res) => {
    user
    .getUserBy('login', req.body.login)
    .then((userData) => {
      if (!userData) {
        user.create({
          login: req.body.login,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 8)
        })
    
        res.status(200).send({
          message: "Регистрация прошла успешно",
          isSignUp: true
        })
      } else {
        return res.status(401).send({
          message: "Такой пользователь уже зарегистрирован!",
          isSignUp: false
        })
      }
    })
  },
  // @ts-ignore
  signin: (req, res) => {
    user
    .getUserBy('login', req.body.login)
    .then((userData) => {
      if (!userData) {
        return res.status(404).send({ message: "Пользователь не найден." });
      }
    
      const loginIsValid = req.body.login === userData.login
      const passwordIsValid = bcrypt.compareSync(req.body.password, userData.password);
    
      if (!passwordIsValid || !loginIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Неправильный логин или пароль!",
        });
      }
    
      let token = jwt.sign(
        {
          login: userData.login,
          password: req.body.password
        },
        config.secret,
        {
          expiresIn: 86400, // 24 hours
        }
      );
      return res.status(200).send({
        token: token,
        id: userData.id,
        username: userData.username,
        message: 'Вход в систему произведён успешно!'
      });
    })
  }
}

export default controller
