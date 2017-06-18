var config = {
    apiKey: "AIzaSyB6ZZgybW35Qo6AUCN-1jJTbQuoq4MHggg",
    authDomain: "fir-firebase-bootstrap.firebaseapp.com",
    databaseURL: "https://fir-firebase-bootstrap.firebaseio.com",
    projectId: "fir-firebase-bootstrap",
    storageBucket: "fir-firebase-bootstrap.appspot.com",
    messagingSenderId: "204622628507"
};
firebase.initializeApp(config);
var chattyRef = firebase.database().ref('chatty/');

var tweets = [];

var addTweet = function(){
    if(!$('#message').val() || !$('#sender').val())
        alert('Please enter all fields');
    else{
        chattyRef.push({
            message: $('#message').val(),
            sender: $('#sender').val(),
            inReplyTo: '',
            timeStamp: $.now()
        });
        $('#message').val('');
    }
};

chattyRef.on('child_added', function(data){
    var val = data.val();
    var tweet = {
        key: data.key,
        sender: val.sender,
        message: val.message,
        timeStamp: (new Date(val.timeStamp)).toLocaleString()
    };
    tweets.unshift(tweet);
    refresh();
});

var delTweet = function(key){
    chattyRef.child(key).remove();
};

chattyRef.on('child_removed', function(data){
    for(var i = 0; i < tweets.length; i++){
        if(tweets[i].key == data.key){
            tweets.splice(i, 1);
            break;
        }
    }
    refresh();
});

var refresh = function(){
    $('#tweets').empty();
    for(var i = 0; i < $('#recent').val() && i < tweets.length; i++){
        var tweet = tweets[i];
        $('#tweets').append('<p class="tweet">' + tweet.sender + ' said<br>' +
          tweet.message + '<br>at ' + tweet.timeStamp +
          '<br><button onclick="delTweet(\'' + tweet.key + '\')">delete</button></p>');
    }
};

$('document').ready(function(){
    refresh();
});
