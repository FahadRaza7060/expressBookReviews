const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

// Authentication routes
const customer_routes = require('./router/auth_users.js').authenticated;

// General routes
const general = require('./router/general.js');

const genl_routes = general.general;
// Axios functions
const getAllBooks = general.getAllBooks;
const getBookByISBN = general.getBookByISBN;
const getBooksByAuthor = general.getBooksByAuthor;
const getBooksByTitle = general.getBooksByTitle;


const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer", resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth (req, res, next) {
//-------- 1st:  Write the authenication mechanism here --------
// Get the access token from the session
const token = req.session.authorization?.accessToken;
if (!token) {
    return res.status(401).json({
        message: "User not logged in"
    });
}
try {
    // Verify the JWT
    const decoded = jwt.verify(token, "access");
    // Store decoded user information if needed
    req.user = decoded;
    next();

} catch (err) {
    return res.status(401).json({
        message: "Invalid or expired token"
    });
}

});
 
const PORT = 5000;

app.use("/customer", customer_routes);

app.use("/", genl_routes);

app.listen(PORT, () => {
    console.log("Server is running");

    // Test Axios functions after server starts
    getAllBooks();
    getBookByISBN(1);
    getBooksByAuthor("Jane Austen");
    getBooksByTitle("Pride and Prejudice");
});