// Homework Due 7.25.19

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var logger = require("morgan");

// Scraping Tools
var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express 
var app = express();

// Configure Middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
//Parce request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/MongoDB-HW", { useNewUrlParser: true });

// Routes
//======================================================================

// GET route to render home html page
app.get("/", function(req, res) {
  res.render("index");
});

// GET route to render saved html page
app.get("/saved", function(req, res) {
  res.render("saved");
});

// GET route to pull up notes modal (optional?)
app.get("???")

// GET route for scraping websites
app.get("/scrape", function(req, res) {

// Make a request via axios to grab the HTML body from the site of your choice
// Source 1 Realtor Magazine
  axios.get("https://magazine.realtor/daily-news").then(function(response) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    // We load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    // Grabbing every h3 with a class of node_title
    $("h3.node__title").each(function(i, element) {

      // Saving an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.source = "Realtor Magazine";
      result.title = $(this).children().text();
      result.link = $(element).find("a").attr("href");

      // Create a new Article using the 'result' object built from the scraping
      db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occured, log it
        console.log(err);
      });
    });

    // Send a message to the client
    res.send("Scrape Complete");

    // Log the results once you've looped through each of the elements found with cheerio
    // console.log(results);
  });

  // Source 2 Realtor.com
  axios.get("https://www.realtor.com/news/real-estate-news/").then(function(response) {

    var $ = cheerio.load(response.data);

    $("h2.entry-title").each(function(i, element) {
      var result = {};
      result.source = "Realtor.com"
      result.title = $(element).children().text();
      result.link = $(element).find("a").attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        })
    });
    res.send("Scrape Complete");
  });

  // Source 3 Forbes 
  axios.get("https://www.forbes.com/real-estate/#3f98ccc4730e").then(function(response) {

    var $ = cheerio.load(response.data);

    $("div.stream-item__text").each(function(i, element) {
      var result = {};
      result.source = "Forbes"
      result.title = $(element).find("a").text();
      result.link = $(element).find("a").attr("href");

      db.Article.create(result)
      .then(function(dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
        console.log(err);
      });
    });
    res.send("Scrape Complete");
  });

  // Source 4 NY Times
  axios.get("https://www.nytimes.com/section/realestate").then(function(response) {

    var $ = cheerio.load(response.data);

    $("div.story-body").each(function(i, element) {
      var result = {};
      result.source = "New York Times"
      result.title = $(element).find("h2").text();
      result.link = $(element).find("a").attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete")
  });

  // Source 5 CCIM
  axios.get("https://www.ccim.com/newscenter/?filter=News%20Release&gmSsoPc=1").then(function(response) {

    var $ = cheerio.load(response.data);

    $("dt").each(function(i, element) {
      var result = {};
      result.source = "CCIM"
      result.title = $(element).find("a").text();
      result.link = $(element).find("a").attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete")
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// GET route to clear the database 
app.get("/clearall", function(req, res) {
  db.articles.remove({}, function(error, response) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(response);
      res.send(response);
    }
  });
});

// GET route to grab specific article by it's ID and populate it with it's notes
app.get("/articles/:id", function(req, res) {
  db.articles.findOne(
    {
      _id: mongojs.ObjectID(req.params.id)
    },
    function(error, found) {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(found);
        res.send(found);
      }
    }
  );
});

// POST route to save a specific article (ie. use req.params.id to grab id of specific article)
app.post("/update/:id", function(req, res) {
  db.articles.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        source: req.body.source,
        title: req.body.title,
        link: req.body.link,
        modified: Date.now()
      }
    },
    function(error, data) {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(data);
        res.send(data);
      }
    }
  );
});

// POST route to delete an article (optional)
app.get("/delete/:id", function(req, res) {
  db.articles.remove(
    {
      _id: mongojs.ObjectID(req.params.id)
    },
    function(error, removed) {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(removed);
        res.send(removed);
      }
    }
  );
});

// POST route to create a new note (and associate it with it's article)

// DELETE route to delete a note (optional)







//Notes
// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ __id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Start the server
// app.listen(PORT, function() {
//   console.log("App running on port " + PORT + "!");
// });

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});