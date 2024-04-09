const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  if (users.find((user) => user.username === username)) {
    return true;
  }
  return false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const isValidUser = isValid(username);
  if (isValidUser) {
    const user = users.find((user) => user.username === username);
    if (user.password === password) {
      return true;
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (authenticatedUser(username, password)) {
    let token = jwt.sign({ username }, "secret");
    //set bearer token in header
    return res.send({ Bearer: token });
  }
  res.send("Invalid username or password");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.body.review;
  let username = req.session.username;

  if (books[isbn].reviews) {
    if (books[isbn]) {
      books[isbn].reviews = { ...books[isbn].reviews, [username]: review };
      console.log(books[isbn].reviews);
    } else {
      books[isbn].reviews = [review];
    }
    res.send("Review added successfully");
  } else {
    res.send("Book not found");
  }
});

//delete base on user session
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let username = req.session.username;
  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.send(`Review by ${username} deleted successfully`);
    } else {
      res.send("Review not found");
    }
  } else {
    res.send("Book not found");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
