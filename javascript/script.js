$(document).ready(function () {

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyD2KRvwcS8hGlf-K7FL4q3htmCIZIwBEHE",
      authDomain: "train-time-96c4f.firebaseapp.com",
      databaseURL: "https://train-time-96c4f.firebaseio.com",
      projectId: "train-time-96c4f",
      storageBucket: "train-time-96c4f.appspot.com",
      messagingSenderId: "483065927309"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    var train = {

      //set up empty values
      trainName: "",
      destination: "",
      firstTrain: "",
      frequency: "",
      tRemainder: 0,
      minutesAway: 0,
      nextTrain: 0,
      nextTrainConverted: 0,

    //Function for pushing train information to firebase
    trainInput: function () {
      train.trainName = $("#trainName").val().trim();
      train.destination = $("#destination").val().trim();
      train.firstTrain = $("#firstTrain").val().trim();
      train.frequency = $("#frequency").val().trim();
      train.trainCalcuation();
      console.log(trainName);
      console.log(destination);
      console.log(firstTrain);
      console.log(frequency);
      database.ref().push({
        trainName: train.trainName,
        destination: train.destination,
        frequency: train.frequency,
        minutesAway: train.minutesAway,
        nextTrain: train.nextTrainConverted,
    })

    },

    //Function for calculating nextTrain and minutesAway
    trainCalcuation: function () {
        var firstTrainConverted = moment(train.firstTrain, "HH:mm").subtract(1, "years");
        console.log(firstTrainConverted);
  
        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
        // Difference between the times
        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
  
        // Time apart (remainder)
        tRemainder = diffTime % train.frequency;
        console.log(tRemainder);
  
        // Minute Until Train
        train.minutesAway = train.frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + train.minutesAway);
  
        // Next Train
        train.nextTrain = moment().add(train.minutesAway, "minutes");
        train.nextTrainConverted = moment(train.nextTrain).format("hh:mm");
        console.log ("MINUTES ARRIVAL TIME:" + train.nextTrain);
        console.log("ARRIVAL TIME: " + train.nextTrainConverted);
        return train.nextTrain;
        return train.nextTrainConverted;
  
    },

  } //Close train object

  database.ref().on("value", function(snapshot) {

    // If any errors are experienced, log them to console.
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  //on click of submit button, run the function trainInput
  $("#submit").on("click", function() {
    train.trainInput();

  });
        
  database.ref().on("child_added",function(snapshot) {

    var newRow = $("<tr>").append(
      $("<td>" + snapshot.val().trainName + "</td>"),
      $("<td>" + snapshot.val().destination + "</td>"),
      $("<td>" + snapshot.val().frequency + "</td>"),
      $("<td>" + snapshot.val().minutesAway + "</td>"),
      $("<td>" + snapshot.val().nextTrain + "</td>"),
    );

      $("#tbody").append(newRow);

    });

}); // end document ready
