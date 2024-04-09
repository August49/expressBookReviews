const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();
const baseUrl = "http://localhost:5000";

public_users.post("/register", function (req, res) {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    res.send("Username and password required");
  } else if (users.some((user) => user.username === username)) {
    res.send("Username already exists");
  } else {
    const user = {
      username,
      password,
    };
    users.push(user);
    res.send("User registered successfully");
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books));
});

async function getBooks() {
  try {
    const response = await axios.get(baseUrl);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn]));
  } else {
    res.send("Book not found");
  }
});

async function getBookDetails(isbn) {
  try {
    const response = await axios.get(`${baseUrl}/isbn/${isbn}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;
  let author_books = [];
  for (let book in books) {
    if (books[book].author === author) {
      author_books.push(books[book]);
    }
  }
  res.send(JSON.stringify(author_books));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title;
  let title_books = [];
  for (let book in books) {
    if (books[book].title === title) {
      title_books.push(books[book]);
    }
  }
  res.send(JSON.stringify(title_books));
});

async function getBookDetailsByTitle(title) {
  try {
    const response = await axios.get(
      `${baseUrl}/title/${encodeURIComponent(title)}`
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews));
  } else {
    res.send("No reviews found for the book");
  }
});

module.exports.general = public_users;
