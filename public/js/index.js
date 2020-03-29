// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBO19FyCA0xL022q3d-T8y6PlLWC8JtRVc",
  authDomain: "digital-courtship.firebaseapp.com",
  databaseURL: "https://digital-courtship.firebaseio.com",
  projectId: "digital-courtship",
  storageBucket: "digital-courtship.appspot.com",
  messagingSenderId: "640848249367",
  appId: "1:640848249367:web:73fcc13a74ebb62be35252",
  measurementId: "G-E6B6172B9P"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var rootRef = firebase.database().ref();
var activitiesRef = firebase.database().ref("activities/");


// class Activity holding data retrieved from firebase
class Activity{
  constructor(title, description, keyword) {
    this.title = title;
    this.description = description;
    this.keyword = keyword;
  }
}

// fills an array of all activities in the database
var all = [];
var i = 0;
var query = firebase.database().ref("activities").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var a = childSnapshot.key;
      var childData = childSnapshot.val();
      var current = new Activity(childData.title, childData.description, a);
      all[i] = current;
      i++;
  });
});

var prev = 99999999999;
var currentKeyword = "";

// displays a random activity
function randActivity() {
  var r = Math.floor(Math.random() * all.length);
  if (r == prev) {
    randActivity();
  } else {
    prev = r;
    var del = document.getElementById("delete");
    currentKeyword = all[r].keyword;
    $('#dateTitle').animate({'opacity': 0}, 1500, function () {
      $(this).html(all[r].title);
    }).animate({'opacity': 1}, 1500);
    $('#dateDes').animate({'opacity': 0}, 1500, function () {
      $(this).html(all[r].description);
    }).animate({'opacity': 1}, 1500);
    if (!del.classList.contains("deleteValid")) {
      del.classList.add("deleteValid");
    }
  }
}

// add a new activity to the database
function addData() {
  let t = document.getElementById("title");
  let d = document.getElementById("des");
  let p = document.getElementById("pass");
  let password = "";
  var query = firebase.database().ref("password").orderByKey();
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        password = childData.pass;
    });
  });
  if (t.value == "" | d.value == "") {
    alert("Error: Please enter valid data.");
  } else {
    if ((p.value).localeCompare(password) == 1) {
      firebase.database().ref('activities/').push({
        title: t.value,
        description: d.value
      });
      d.value = "";
      t.value = "";
      p.value = "";
      alert("Date added successfully!");
    } else {
      alert("Incorrect password");
    }
  }
}

// delete an activity from the database
function deleteDate() {
  firebase.database().ref("activities/" + currentKeyword).remove()
  .then(function() {
    alert("Date removed successfully!")
  })
  .catch(function(error) {
    alert("Remove failed: " + error.message)
  });
}
