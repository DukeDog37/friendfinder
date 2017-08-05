// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Star Wars Characters (DATA)
// =============================================================
var friends = [{
    name: "Jason",
    email: "jason@gmail.com",
    image: "https://www.fillmurray.com/g/200/300",
    scores: [1,2,3,4,5,4,3,2,1,2]
    },
    {
    name: "Jeff",
    email: "jason@gmail.com",
    image: "https://www.fillmurray.com/200/300",
    scores: [2,3,4,3,4,3,2,2,2,2]
    },
    {
    name: "Jaron",
    email: "jason@gmail.com",
    image: "http://www.stevensegallery.com/g/200/300",
    scores: [3,3,3,4,4,4,3,3,3,3]
    },
    {
    name: "Burt",
    email: "jason@gmail.com",
    image: "http://www.stevensegallery.com/200/300",
    scores: [3,3,3,3,3,3,3,3,3,3]
    },
    {
    name: "Jackson",
    email: "jason@gmail.com",
    image: "http://www.placecage.com/200/300",
    scores: [4,4,4,4,4,4,4,4,4,4]
    },
    {
    name: "Jules",
    email: "jason@gmail.com",
    image: "http://www.placecage.com/gif/200/300",
    scores: [5,5,5,5,5,5,5,5,5,5]
    },
    {
    name: "Almondo",
    email: "jason@gmail.com",
    image: "http://www.placecage.com/g/200/300",
    scores: [4,3,5,5,5,4,3,2,3,4]
    },
    {
    name: "River",
    email: "jason@gmail.com",
    image: "http://www.placecage.com/c/200/300",
    scores: [3,4,2,2,3,5,1,2,3,3]
    },
    {
    name: "Best Match",
    email: "jason@gmail.com",
    image: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAq7AAAAJDAwYzI4NTQ4LWYwZWUtNGFkYS1hNTYwLTZjYzkwY2ViZDA3OA.jpg",
    scores: [2,2,2,2,2,2,2,2,2,2]
    },
    {
    name: "Basin",
    email: "jason@gmail.com",
    image: "http://www.placecage.com/c/200/300",
    scores: [4,3,2,5,4,3,1,3,4,5]
    }];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "app/routing/view.html"));
});

app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "app/routing/add.html"));
});

app.get("/all", function(req, res) {
  res.sendFile(path.join(__dirname, "app/routing/all.html"));
});

app.get("/match/:image?", function(req, res) {
  var reqImg = req.params.image;
  res.sendFile(path.join(__dirname, "app/data/" + reqImg));
});

// Search for Specific Character (or all characters) - provides JSON
app.get("/api/:friends?", function(req, res) {
  var chosen = req.params.friends;

  if (chosen) {
    console.log(chosen);

    for (var i = 0; i < friends.length; i++) {
      if (chosen === friends[i].name) {
        return res.json(friends[i]);
      }
    }

    return res.json(false);
  }
  return res.json(friends);
});

// Create New Member - takes in JSON input
app.post("/api/new", function(req, res) {
  var newFriend = req.body;
  newFriend.name = newFriend.name.replace(/\s+/g, "").toLowerCase();
  //console.log(newFriend);
  //call function to compare new friend to all in array and find best match
  //the best match should be the response data from this post
  var bestFriend = fnCompareScores(friends, newFriend);
  friends.push(newFriend);
  return res.json(bestFriend);

  //show new friend suggestion
  //console.log(bestFriend.image);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});


//compare function
function fnCompareScores(friends, newFriend){
  //using the friends array compare the
  var existingFriends = friends; 
  var compareFriends = [];
  var QDiffTotal = 0;
  var QDiffLast = 0;
  var idxBestMatch = 0;
  for(var i = 0; i < existingFriends.length; i++){
      QDiffTotal = 0;
      for(var b = 0; b < 10; b++){
          var QDiff = 0;
          QDiff = Math.abs(newFriend.scores[b]) - Math.abs(existingFriends[i].scores[b]);
          QDiffTotal = QDiffTotal + Math.abs(QDiff);
      }
      if(i == 0){
        QDiffLast = QDiffTotal;
        idxBestMatch = i;
      }
      else{
        if(QDiffTotal < QDiffLast){
          idxBestMatch = i;
        }
      }
      
  }
      //console.log(existingFriends[idxBestMatch]);
      return existingFriends[idxBestMatch];

}