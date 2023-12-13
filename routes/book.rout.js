const express = require("express");
const router = require("express").Router();
const Book = require("../models/book.model");

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ status: "Success", data: { books } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get a book
router.get("/:bookId", async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    return res.status(201).json({ status: "Success", data: book });
  } catch (err) {}
});

// Add a new book
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    publishTime: req.body.publishTime,
  });
  try {
    const newBook = await book.save();
    res.status(201).json({ status: "Success", data: { newBook } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:bookId", async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.json("Book Not Found");
    } else {
      await book.deleteOne();
      return res.status(201).json({ status: "Success", data: null });
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

module.exports = router;
