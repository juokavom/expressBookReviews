const express = require("express");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
let verifyJWT = require("./router/auth_users.js").verifyJWT;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];
    verifyJWT(token, (err, user) => {
      if (!err) {
        req.username = user.username;
        next();
      } else {
        return res.status(403).json({
          message: "User not authenticated",
        });
      }
    });
  } else {
    res.status(403).json({
      messge: "User not logged in",
    });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
