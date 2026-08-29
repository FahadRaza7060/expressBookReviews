const express = require("express");
let books = require("./booksdb.js");

const axios = require("axios");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  // Check if the username already exists
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // register the new user
  users.push({ username, password });

  return res
    .status(201)
    .json({ message: "Customer successfully registered. Now you can login." });
});

function getAllBooks() {
  axios
    .get("http://localhost:5000/")
    .then((response) => {
      console.log("All Books:");
      console.log(response.data);
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
}

// Get book by ISBN using Axios + async/await
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    console.log("Book:");
    console.log(response.data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// Get books by author using Axios + async/await
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`,
    );

    console.log("Books by Author:");
    console.log(response.data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// Get books by title using Axios + Promise
function getBooksByTitle(title) {
  axios
    .get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
    .then((response) => {
      console.log("Books by Title:");
      console.log(response.data);
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
}

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;