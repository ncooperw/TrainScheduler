// Initialize Firebase
var config = {
    apiKey: "AIzaSyCOwfSoXkCls9NloukJpnqnSAmIV89ENf8",
    authDomain: "trainscheduler-b2a3a.firebaseapp.com",
    databaseURL: "https://trainscheduler-b2a3a.firebaseio.com",
    projectId: "trainscheduler-b2a3a",
    storageBucket: "",
    messagingSenderId: "202231604169"
};

firebase.initializeApp(config);

var database = firebase.database();

//capture click
$("#addTrain").on("click", function (event) {
    event.preventDefault();
    console.log("Clicked");
    //grab input values
    var trainName = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var freq = $("#frequency").val().trim();

    //pushing data to firebase

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: freq
    });

    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(freq);

});
//Firebase setup
database.ref().on("child_added", function (childSnapshot) {
    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFreq = childSnapshot.val().frequency;

    //first time (pushed back 1 year to make sure it comes before the current time)
    var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

    //current time
    var currentTime = moment();

    //difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");

    //time apart (remainder)
    var tRemainder = diffTime % newFreq;

    //minutes until train
    var tMinutesTillTrain = newFreq - tRemainder;

    //next train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");

    //display
    $(".trainList").append(
        '<tr><td>' + newTrain +
        '</td><td>' + newLocation +
        '</td><td>' + newFreq +
        '</td><td>' + catchTrain +
        '</td><td>' + tMinutesTillTrain + '</td></tr>'
    );
    //Clear input fields
    $("#name-input, #destination-input, #first-train, #frequency")
    return false;
})



//Handle the errors
// function(errorObject){
//     console.warn("Errors handled: "+ errorObject.code);
// };