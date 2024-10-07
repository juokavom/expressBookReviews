const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

function verifyJWT(token, callback) {
  jwt.verify(token, "secretKey", callback);
}

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.find((u) => u.username == username) == undefined;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password to login" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        username: username,
      },
      "secretKey",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("Successfull login!");
  } else {
    return res.status(401).json({ message: "Wrong username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({
      message: "No review provided",
    });
  }

  const book = Object.entries(books).find(([ISBN, book]) => ISBN == isbn);
  if (!book) {
    return res.status(404).json({
      message: `Book with ISBN = ${isbn} is not found!`,
    });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Successfully added review!",
    book: books[isbn],
  });
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.username;
  const isbn = req.params.isbn;

  const book = Object.entries(books).find(([ISBN, book]) => ISBN == isbn);
  if (!book) {
    return res.status(404).json({
      message: `Book with ISBN = ${isbn} is not found!`,
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Successfully deleted review!",
    book: books[isbn],
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.verifyJWT = verifyJWT;
