const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      return res.status(404).json({ message: "Username is taken!" });
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User registered." });
    }
  }
  return res
    .status(404)
    .json({ message: "Please provide username and password!" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  const list = await new Promise((resolve, reject) => {
    resolve(Object.values(books));
  });
  return res.status(200).send(JSON.stringify(list));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const book = await new Promise((resolve, reject) => {
    resolve(
      Object.entries(books)
        .filter(([ISBN, book]) => ISBN == req.params.isbn)
        .map(([ISBN, book]) => book)
    );
  });
  if (book.length == 0) {
    return res.status(404).json({
      message: `Book with ISBN = ${req.params.isbn} is not found!`,
    });
  }
  return res.status(200).send(JSON.stringify(book));
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const author = await new Promise((resolve, reject) => {
    resolve(
      Object.values(books).filter((book) => book.author == req.params.author)
    );
  });
  if (author.length == 0) {
    res.status(404).json({
      message: `Book with Author = ${req.params.author} is not found!`,
    });
  }
  return res.status(200).send(JSON.stringify(author));
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const title = await new Promise((resolve, reject) => {
    resolve(
      Object.values(books).filter((book) => book.title == req.params.title)
    );
  });
  if (title.length == 0) {
    return res.status(404).json({
      message: `Book with Title = ${req.params.title} is not found!`,
    });
  }
  return res.status(200).send(JSON.stringify(title));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const reviews = Object.entries(books)
    .filter(([ISBN, book]) => ISBN == req.params.isbn)
    .map(([ISBN, book]) => book.reviews);
  if (reviews.length == 0) {
    return res.status(404).json({
      message: `Book reviews with ISBN = ${req.params.isbn} is not found!`,
    });
  }
  return res.status(200).send(JSON.stringify(reviews));
});

module.exports.general = public_users;
