var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

var sqlite3 = require('sqlite3');

const Book = require("../models").Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get the books listing, show books in decending order
router.get('/', function (request, response, next) {
    let pg = request.query.page;

    if (!pg)
        pg = 1;

    Book.findAll({
        order: [["createdAt", "DESC"]]
    }).then(function (totalBks) {
        Book.findAll({
            order: [["createdAt", "DESC"]],
            offset: (pg * 8) - 8,
            limit: 8
        }).then(function (books) {
            const totalPgs = Math.ceil(totalBks.length / 8);
            response.render("all_books", { title: "Books", books: books, totalPgs: totalPgs });
        }).catch(function (err) {
            console.log(err);
            response.sendStatus(500);
        });
    });
});

// Render the new book form
router.get("/new", function (request, response, next) {
    response.render("new_book", { title: "New Book", book: Book.build() });
});

// Create the new book if there are no errors
router.post('/new', function (request, response, next) {
    Book.create(request.body).then(function(book) {
         response.redirect("/");
     }).catch(function(err) {
         if(err.name === "SequelizeValidationError") {
             response.render("new_book", {
                 book: Book.build(request.body), 
                 title: "New Book",
                 errors: err.errors
             });            
         } else {
             throw err;
         }
     }).catch(function(err) {
         response.sendStatus(500);
     });
});

// Route to perform a post search using the posted search values title, author, genre and year
router.post('/search', function (request, response, next) {
    let pg = request.query.page;

    if (!pg)
        pg = 1;

    let searchCriteria = [];

    if (request.body.title != "") {
        searchCriteria.push({
            title: {
                [Op.like]: '%' + request.body.title + '%'
            }
        });
    }

    if (request.body.author != "") {
        searchCriteria.push({
            author: {
                [Op.like]: '%' + request.body.author + '%'
            }
        });
    }

    if (request.body.genre != "") {
        searchCriteria.push({
            genre: {
                [Op.like]: '%' + request.body.genre + '%'
            }
        });
    }

    if (request.body.year != "") {
        searchCriteria.push({year: request.body.year});
    }

    Book.findAll({
        order: [["createdAt", "DESC"]],
        where: {
            [Op.and]: searchCriteria
        }
    }).then(function (totalSearchBks) {
        Book.findAll({
            order: [["createdAt", "DESC"]],
            where: {
                [Op.and]: searchCriteria
            },
            offset: (pg * 8) - 8,
            limit: 8
        }).then(function (books) {
            const totalPgs = Math.ceil(totalSearchBks.length / 8);
            response.render("search", {
                title: "Books", books: books, totalPgs: totalPgs,
                searchTitle: request.body.title, searchAuthor: request.body.author, searchGenre: request.body.genre,
                searchYear: request.body.year});
        }).catch(function (err) {
            console.log(err);
            response.sendStatus(500);
        });
    });
});

// Route to perform a get search for the pagination links using the query parameters title, author, genre and year
router.get('/search', function (request, response, next) {
    let pg = request.query.page;

    if (!pg)
        pg = 1;

    let searchCriteria = [];

    if (request.query.title != "") {
        searchCriteria.push({
            title: {
                [Op.like]: '%' + request.query.title + '%'
            }
        });
    }

    if (request.query.author != "") {
        searchCriteria.push({
            author: {
                [Op.like]: '%' + request.query.author + '%'
            }
        });
    }

    if (request.query.genre != "") {
        searchCriteria.push({
            genre: {
                [Op.like]: '%' + request.query.genre + '%'
            }
        });
    }

    if (request.query.year != "") {
        searchCriteria.push({ year: request.query.year });
    }

    Book.findAll({
        order: [["createdAt", "DESC"]],
        where: {
            [Op.and]: searchCriteria
        }
    }).then(function (totalSearchBks) {
        Book.findAll({
            order: [["createdAt", "DESC"]],
            where: {
                [Op.and]: searchCriteria
            },
            offset: (pg * 8) - 8,
            limit: 8
        }).then(function (books) {
            const totalPgs = Math.ceil(totalSearchBks.length / 8);
            response.render("search", {
                title: "Books", books: books, totalPgs: totalPgs,
                searchTitle: request.query.title, searchAuthor: request.query.author, searchGenre: request.query.genre,
                searchYear: request.query.year});
        }).catch(function (err) {
            console.log(err);
            response.sendStatus(500);
        });
    });
});

// Route to show the book detail of the selected book
router.get("/:id", function (request, response, next) {
    Book.findByPk(request.params.id).then(function (book) {
        if (book) {
            response.render("book_detail", { title: book.title, book: book});
        } else {
            response.render("page_not_found", { title: "Page Not Found" });
            response.sendStatus(404);
        }
    }).catch(function (err) {
        response.sendStatus(500);
    });
});

// Route to update the selected book
router.post("/:id", function (request, response, next) {
    Book.findByPk(request.params.id).then(function (book) {
        if (book) {
            return book.update(request.body);
        } else {
            response.sendStatus(404);
        }
    }).catch(function (err) {
        if (err.name === "SequelizeValidationError") {
            var book = Book.build(request.body);
            book.id = request.params.id;

            response.render("book_detail", {
                book: book,
                title: "Edit Book",
                errors: err.errors
            });
        } else {
            throw err;
        }
    }).then(function (book) {
        response.redirect("/");
    }).catch(function (err) {
        response.sendStatus(500);
    });
});

// Route to delete the selected book
router.post("/:id/delete", function (request, response, next) {
    Book.findByPk(request.params.id).then(function(book){
        if(book) {
          return book.destroy();
        } else {
          response.sendStatus(404);
        }
    }).then(function() {
        response.redirect("/");
    }).catch(function(err) {
    response.send(500);
    });
});

module.exports = router;
