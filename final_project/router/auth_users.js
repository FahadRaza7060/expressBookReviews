const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // ----- write code to check is the username is valid ------
  const user = users.find((user) => user.username === username);
  return !user; // return true if user is present
};

const authenticatedUser = (username, password) => {
  // -------- write code to check if username and password match the one we have in records. --------
  const user = users.find(
    (user) => user.username === username && user.password === password,
  );

  return !!user;
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  // Generate JWT
  const accessToken = jwt.sign({ username: username }, "access", {
    expiresIn: "1h",
  });
  // Save token in session
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Customer successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;
  const review = req.body.review;
  
  // check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  // Check if review is provided
  if (!review) {
    return res.status(400).json({message: "Review is required" });
  }
  
  // Add or modify the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  
  const isbn = req.params.isbn;
  const username = req.user.username;

    // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // Check if the user has a review
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review not found for this user"
  });
  }

  // Delete only this user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({message: "Review deleted successfully" });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;