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

// Database configuration -----------------------------------------------------NEEDED???
// Save the URL of our database as well as the name of our collection
// var databaseUrl = "MongoDB-HW";
// var collections = ["articles"];
 
// Use mongojs to hook the database to the db variable-------------------------NEEDED???
// var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes

// A GET route for scraping from the source websites
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

      // Save these results in an object that we'll push into the results array we defined earlier
      // results.push({
      //   source: "Realtor Magazine",
      //   title: title,
      //   link: link
      // });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
  });

  // Source 2 Realtor.com
  axios.get("https://www.realtor.com/news/real-estate-news/").then(function(response) {

    var $ = cheerio.load(response.data);

    $("h2.entry-title").each(function(i, element) {

      var title = $(element).children().text();
      var link = $(element).find("a").attr("href");

      results.push({
        source: "Realtor.com", 
        title: title,
        link: link
      });
    });

    console.log(results);
  });

  // Source 3 Forbes 
  axios.get("https://www.forbes.com/real-estate/#3f98ccc4730e").then(function(response) {

    var $ = cheerio.load(response.data);

    $("div.stream-item__text").each(function(i, element) {

      var title = $(element).find("a").text();
      var link = $(element).find("a").attr("href");

      results.push({
        source: "Forbes",
        title: title,
        link: link
      });
    });
    console.log(results);
  });

  // Source 4 NY Times
  axios.get("https://www.nytimes.com/section/realestate").then(function(response) {

    var $ = cheerio.load(response.data);

    $("div.story-body").each(function(i, element) {

      var title = $(element).find("h2").text();
      var link = $(element).find("a").attr("href");

      results.push({
        source: "New York Times",
        title: title,
        link: link
      });
    });
    console.log(results);
  });

  // Source 5 CCIM
  axios.get("https://www.ccim.com/newscenter/?filter=News%20Release&gmSsoPc=1").then(function(response) {

    var $ = cheerio.load(response.data);

    $("dt").each(function(i, element) {

      var title = $(element).find("a").text();
      var link = $(element).find("a").attr("href");

      results.push({
        source: "CCIM",
        title: title,
        link: link
      });
    });
    console.log(results);
  });
});