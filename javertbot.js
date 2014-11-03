/**
 * Project 5: Social Bot
 * "JavertBot" by Stephen Song (ssong73)
 * LMC 2700 Fall 2014
 */

// setup/control
var Twit = require('twit');
var T = new Twit(require('./config.js'));
var debug = false; // tweets if true, prints to console if false

// queries
var interruptQuery = {q: "%22my%20name%20is%22", count: 10, result_type: "recent"};
var foodQuery = {q: "%23bread", count: 10, result_type: "recent"};
var broadwayQuery = {q: "les%20miserables", count: 10, result_type: "recent"};
var trendingQuery = {id: 1};
var tweetText;
var mentionId;

// helper function for arrays, picks a random thing
Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}

// 37 Javert-like lines
var danger = [
	"Your time is up and your parole's begun!",
	"It warns that you're a dangerous man!",
	"Five years for what you did!",
	"Do not forget my name!",
	"No man's beyond our reach, let all beware.",
	"It seems to me... We may have met.",
	"Save your breath and save your tears.",
	"He will bend. He will break. This time there is no mistake!",
	"We see each other plain!",
	"You'll wear a different chain!",
	"My duty's to the law! You have no rights!",
	"Every man is born in sin!",
	"You know nothing of Javert.",
	"There is no place for you to hide.",
	"I swear to you, I will be there!",
	"Another brawl in the square, another stink in the air!",
	"But let these vermin beware, we'll see that justice is done!",
	"Clear this garbage off the street!",
	"That those who falter and those who fall must pay the price!",
	"This I swear by the stars!",
	"One day more to revolution, we will nip it in the bud!",
	"I have been to their lines, I have counted each man.",
	"Death to each and every traitor, I renounce your people's court!",
	"If you let me go, beware, you'll still answer to Javert!",
	"I am the Law and the Law is not mocked!",
	"Please know me as Javert, I'm here at your command.",
	"Honest work. Just reward. That's the way to please the Lord.",
	"I have only known one other who can do what you have done.",
	"Men like me can never change. Men like you can never change.",
	"I never shall yield... Till we come face to face.",
	"He knows his way in the dark... Mine is the way of the Lord.",
	"And those who follow the path of the righteous... Shall have their reward.",
	"Stars... In your multitudes. Scarce to be counted. Filling the darkness.",
	"I will learn their little secrets, I will know the things they know.",
	"The law is inside out. The world is upside down.",
	"The man of mercy comes again and talks of justice.",
	"My heart is stone and still it trembles."
	+ "The world I have known is lost in shadow."
];

// 7 questions to post on trending hashtags
var question = [
	"Tell me quickly what's the story, who saw what, and why, and where?",
	"Can this be true? I don't believe what I see!",
	"Can this man be believed?",
	"Shall his sins be forgiven?",
	"Shall his crimes be reprieved?",
	"And must I now begin to doubt, who never doubted all these years?",
	"Is he from heaven or from hell?"
];

// 3 food related lines for #bread
var food = [
	"And you will starve again, unless you learn the meaning of the law!",
	"They intend to starve you out, before they start a proper fight.",
	"You've hungered for this all your life. Take your revenge!"
];

// tweets a food quote to the query "#bread"
function tweetFood() {

	T.get('search/tweets', foodQuery, function (error, data) {
		if (!error) {
			tweet = data.statuses.pick();
  			mentionId = tweet.id_str;
  			tweetText = "@" + tweet.user.screen_name + " " + food.pick()
  			+ " #bread";
		} else {
			console.log('There was an error with your hashtag search:', error);
		}

		if (debug) {
			console.log('Debug mode: ', tweetText);
		} else {
			T.post('statuses/update', {status: tweetText,
				in_reply_to_status_id: mentionId}, function(err, reply) {
				if (err != null){
					console.log('Error: ', err);
				}
				else {
					console.log('Tweeted: ', tweetText);
				}
			});
		}

	});
}

// interrupts a random conversation where one of the tweets contains "my name is"
function interruptConversation() {

	T.get('search/tweets', interruptQuery, function (error, data) {
		if (!error) {
			for (i = 0; i < data.statuses.length; i++) {
		  		if (data.statuses[i].in_reply_to_screen_name != null) {
		  			mentionId = data.statuses[i].id_str;
		  			tweetText = "AND I'M JAVERT @"
		  			+ data.statuses[i].in_reply_to_screen_name + " @"
		  			+ data.statuses[i].user.screen_name;
		  		}
		  	}
		} else {
			console.log('There was an error with your hashtag search:', error);
		}

		if (debug) {
			console.log('Debug mode: ', tweetText);
		} else {
			if (tweetText == null) {
				console.log('No conversations to interrupt.');
			} else {
				T.post('statuses/update', {status: tweetText,
					in_reply_to_status_id: mentionId}, function(err, reply) {
					if (err != null){
						console.log('Error: ', err);
					}
					else {
						console.log('Tweeted: ', tweetText);
					}
				});
			}
		}

	});
}

// tweets a random reply to a random reply on a random trending hashtag
function tweetRandom() {

	T.get('trends/place', trendingQuery, function (error, data) {
		if (!error) {
			var subquery = {q: data[0].trends.pick().query, count: 2,
				result_type: "popular"};
			T.get('search/tweets', subquery, function (error, subdata) {
				var tweet;
				for (i = 0; i < subdata.statuses.length; i++) {
					if (subdata.statuses[i] != null) {
						tweet = subdata.statuses[i];
						mentionId = tweet.id_str;
	  				tweetText = "@" + tweet.user.screen_name + " " + question.pick();
					}
				}

	  			if (debug) {
					console.log('Debug mode: ', tweetText);
				} else {
					T.post('statuses/update', {status: tweetText,
						in_reply_to_status_id: mentionId}, function(err, reply) {
						if (err != null){
							console.log('Error: ', err);
						}
						else {
							console.log('Tweeted: ', tweetText);
						}
					});
				}
			});
		} else {
			console.log('There was an error with your hashtag search:', error);
		}

	});
}

// tweets a danger quote to the query "les miserables"
function tweetBroadway() {

	T.get('search/tweets', broadwayQuery, function (error, data) {
		if (!error) {
			tweet = data.statuses.pick();
  			mentionId = tweet.id_str;
  			tweetText = "@" + tweet.user.screen_name + " " + danger.pick();
		} else {
			console.log('There was an error with your hashtag search:', error);
		}

		if (debug) {
			console.log('Debug mode: ', tweetText);
		} else {
			T.post('statuses/update', {status: tweetText,
				in_reply_to_status_id: mentionId}, function(err, reply) {
				if (err != null){
					console.log('Error: ', err);
				}
				else {
					console.log('Tweeted: ', tweetText);
				}
			});
		}

	});
}

// randomly selects an action to do
function tweet() {
	var rand = Math.random();
	if(rand >= 0.95) {
		console.log("TWEETING ABOUT BREAD =============================");
		tweetFood();
	} else if (rand >= 0.6) {
		console.log("INTERRUPTING CONVERATION =========================");
		interruptConversation();
	} else if (rand >= 0.3) {
		console.log("TWEETING TO A TRENDING TOPIC =====================");
		tweetRandom();
	} else {
		console.log("TWEETING TO BROADWAY =============================");
		tweetBroadway();
	}
}

// seed the bot by running once
tweet();

// do someting every 10 minutes
setInterval(tweet, 1000 * 60 * 10);
