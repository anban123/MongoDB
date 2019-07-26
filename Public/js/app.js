// Homework due 7.25.19

// Click event for the Scrape Articles button
$("#scrape").on("click", function(event) {
    event.preventDefault();
    console.log("Scrape button works");

    //send this to/trigger server.js to run scraping...

    $.getJSON("/articles", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Create the card for each article
            $("#articles").append
                (`<div id='articles>
                <div class='card'>
                <div class='card-header'>${data.source}</div>
                <div class='card-body'>
                <h5 class='card-title'>${data.title}</h5>
                <p class='card-text'>${data.summary}</p>
                <a href='${data.link}' id='full-article' class='btn btn-primary'>View Full Article</a>
                </div>
                </div>
                </div>`)
        }
    }); 
});

// Click event for the Clear Articles button
$("#clear").on("click", function() {
    event.preventDefault();
    console.log("Clear button works");
    $(".card").empty();
});

// Click event for the dynamic View Full Article button
$("#clear").on("click", "#full-article", function() {
    event.preventDefault();

    console.log("View Full Article button works");

    // send user to link
});

// Handle Save Article button


// Handle Delete Article button

// Handle Save Note button

// Handle Delete Note button







// Notes
// // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//     //Empty the notes from the note section
//     $("#notes").empty();
//     // Save the id from the p tag
//     var thisID = $(this).attr("data-id");

//     // Now make an ajax call for the Article
//     $.ajax({
//         method: "GET",
//         url: "/articles/" + thisId
//     })
//         // With that done, add the note information to the page
//         .then(function(data) {
//             console.log(data);
//             // The title of the article
//             $("#notes").append("<h2>" + data.title + "</h2>");
//             // An input to enter a new title
//             $("#notes").append("<input id='titleinput' name='title' >");
//             // A textarea to add a new note body
//             $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//             // A button to submit a new note, with the id of the article saved to it
//             $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//             // If there's a note in the article
//             if (data.note) {
//                 //Place the title of the note in the title input
//                 $("#titleinput").val(data.note.title);
//                 // Place the body of the note in the body textarea
//                 $("#bodyinput").val(data.note.body);
//             }
//         });
// });

// // When you click the savenote button
// $(document).on("click", "#savenote", function() {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");

//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//         method: "POST",
//         url: "/articles/" + thisId,
//         data: {
//             // Value taken from title input
//             title: $("#titleinput").val(),
//             // Value taken from note textarea
//             body: $("#bodyinput").val()
//         }
//     })
//         // With that done
//         .then(function(data) {
//             // Log the response
//             console.log(data);
//             // Empty the notes section
//             $("#notes").empty();
//         });

//     // Also, remove the values entered in the input and textarea for note entry
//     $("titleinput").val("");
//     $("bodyinput").val("");
// });

