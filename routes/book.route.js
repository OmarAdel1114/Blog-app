const express = require("express");
const router = express.Router();
const Book = require("../models/book.model");

// Route to get all books
router.get("/", async (req, res) => {
  try {
    // Retrieve all books from the database
    const books = await Book.find();
    res.json({ status: "Success", data: { books } });
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: err.message });
  }
});

// Route to get a specific book by ID
router.get("/:bookId", async (req, res) => {
  try {
    // Find a book by its ID
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      // If the book is not found, return an error message
      return res.status(404).json({ message: "Book not found" });
    }

    // Return the found book
    res.json({ status: "Success", data: book });
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: err.message });
  }
});

// Route to add a new book
router.post("/", async (req, res) => {
  // Create a new book based on the request body
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    publishTime: req.body.publishTime,
  });

  try {
    // Save the new book to the database
    const newBook = await book.save();
    res.status(201).json({ status: "Success", data: { newBook } });
  } catch (err) {
    // Handle validation or server error
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a book by ID
router.delete("/:bookId", async (req, res) => {
  try {
    // Find a book by its ID
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      // If the book is not found, return an error message
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete the found book
    await book.deleteOne();
    res.status(201).json({ status: "Success", data: null });
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
