/*
(C)grjoshi 3/30/2016
psoft2.js - Main server code for PredictSoft v2
			Handles database operations and APIs for reading/writing data
      Forked off of NoFApp v1 built for Twenty 20 Cricket 2016
*/

var express = require('express');
var app = express();
var morgan = require('morgan');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');      //for letting Express handle POST data
var favicon = require('serve-favicon');

var dbconfig = require('./dbconfig.js');        //load config module

//load API modules
var utils = require("./api/PS2Utils.js");
//var users = require("./api/userModule.js")

//define port that server will run on
var port = 8080;

/*==========================DB definitions================================*/

var sqlConn = new Sequelize(
    dbconfig.database,    //prod DB
    dbconfig.user,          //user
    dbconfig.password,      //pass
    {
        host: 'gubuntu.duckdns.org',
        dialect: 'mysql',
        logging: false,
        define: {
            freezeTableName: true          //so table names won't be assumed pluralized by the ORM
        },
        pool: {
            max: 50,
            min: 0,
            idle: 10000
        }
    });

var Users = sqlConn.import(__dirname + "/models/userModel");
var Prediction = sqlConn.import(__dirname + "/models/predictionModel");
//var Match = sqlConn.import(__dirname + "/models/matchModel");
//var Team = sqlConn.import(__dirname + "/models/teamModel");

//define relations
//Match.hasMany(Team, {foreignKey: 'teamID'});
//Team.belongsTo(Match, {foreignKey: 'team1ID'});
//Team.belongsTo(Match, {foreignKey: 'team2ID'});

sqlConn.sync();

utils.logMe("Loaded Sequelize modules...");


app.use(express.static(__dirname));
app.use(favicon(__dirname + '/assets/img/favicon.ico'));

app.use(bodyParser.json());                 		//this lets Express handle POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));


/*=====================================Routing and APIs=====================================*/

//default route
app.get("/", function (req, res) {
    res.redirect('/app/index.html');
});

//return the next match(es) information
app.get("/api/nextmatch", function (req, res) {
    var resObj = {
        count: 0,
        matchData: [],
        message: "",
        success: false
    };
    //Using isActive column to determine which matches are to be shown
    sqlConn.query(
        "SELECT team1.teamID as t1ID,team1.name as t1Name,team1.groupID as t1Group, team2.teamID as t2ID,team2.name as t2Name, team2.groupID as t2Group, match.matchID as matchID, match.MatchDate as date FROM `match` LEFT JOIN (teams as team1, teams as team2) ON (team1.teamID = `match`.Team1ID AND team2.teamID = `match`.Team2ID) WHERE isActive=1",
        { type: sqlConn.QueryTypes.SELECT })
        .then(function (matches) {
        //fill response object and return
        resObj.success = true;
        resObj.count = matches.length;
        
        for (var n = 0; n < matches.length; n++) {
            resObj.matchData.push({
                team1ID: matches[n].t1ID,
                team1Name: matches[n].t1Name,
                team1Group: matches[n].t1Group,
                team2ID: matches[n].t2ID,
                team2Name: matches[n].t2Name,
                team2Group: matches[n].t2Group,
                matchID: matches[n].matchID,
                date: matches[n].date
            });
        }
        res.json(resObj);
        res.end();
        return;
    })
        .catch(function (err) {
        //match find failed. Reply with message
        utils.logMe("Error trying to fetch match details.Message:\n" + err);
        resObj.success = false;
        resObj.message = err;
        
        res.json(resObj);
        res.end();
        return;
    })
})

//list predictions for upcoming match from submitted players
app.get("/api/getPredictions", function (req, res) {
    var resObj = {
        predictData: [],
        message: "",
        success: false
    };
    
    sqlConn.query(
        "SELECT u.name as name, (SELECT Name FROM teams WHERE teamID = p.predictedTeamID) As PredictedTeam FROM prediction p, users u WHERE p.playerID = u.userID AND p.matchID IN ( SELECT matchID FROM `match` WHERE isActive =1 AND isHidden=0)",
      { type: sqlConn.QueryTypes.SELECT })
      .then(function (predictions) {
        resObj.success = true;
        for (var n = 0; n < predictions.length; n++) {
            //console.log(JSON.stringify(predictions));
            resObj.predictData.push({
                Name: predictions[n].name,
                Team: predictions[n].PredictedTeam
            });
        }
        res.json(resObj);
        res.end();
        return;
    })
      .catch(function (err) {
        utils.logMe("Error trying to fill in prediction data. Details:\n" + err);
        resObj.success = false;
        resObj.message = err;
        res.json(resObj);
        return;
    })
})

//get leaderboard scores, sorted by points
app.get("/api/getScores", function (req, res) {
    var resObj = {
        scoreData: [],
        message: "",
        success: false
    };
    
    sqlConn.query(
        "SELECT u.name, u.points FROM users u ORDER BY points DESC",
      { type: sqlConn.QueryTypes.SELECT })
      .then(function (scores) {
        
        resObj.success = true;
        
        for (var n = 0; n < scores.length; n++) {
            //console.log(JSON.stringify(scores));
            resObj.scoreData.push({
                Name: scores[n].name,
                Points: scores[n].points
            });
        }
        
        res.json(resObj);
        res.end();
        return;
    })
      .catch(function (err) {
        utils.logMe("Error trying to fill in score data. Details:\n" + err);
        //get player prediction for upcoming match
        resObj.success = false;
        resObj.message = err;
        res.json(resObj);
        return;
    })
})

//check if user has already predicted
app.get("/api/checkIfPredicted", function (req, res) {
    var resObj = {
        message: "",
        hasPredicted: false
    };
    
    var playerID = req.query.userID;
    
    sqlConn.query(
        "SELECT * FROM prediction p WHERE playerID = " + playerID + " AND matchID IN (SELECT matchID FROM `match` WHERE isActive = 1)",
    { type: sqlConn.QueryTypes.SELECT })
    .then(function (predictionCount) {
        if (predictionCount.length > 0) {
            resObj.hasPredicted = true;
        }
        else {
            resObj.hasPredicted = false;
        }
        
        res.json(resObj);
        res.end();
        return;
    })
    .catch(function (err) {
        utils.logMe(err);
        resObj.message = err;
        resObj.hasPredicted = true;
        res.json(resObj);
        return;
    })
})

//get user's game history
app.get("/api/getHistory", function (req, res) {
    var resObj = {
        count: 0,
        historyData: [],
        message: "",
        success: false
    };
    
    var playerID = req.query.userID;
    
    sqlConn.query(
        "SELECT m.MatchDate as match_date,(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team1ID) as team1,(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team2ID) as team2,(SELECT teams.Name FROM teams WHERE teams.teamID = p.predictedTeamID) as predicted_team,(SELECT teams.Name FROM teams WHERE teams.teamID = m.WinningTeamID) as winning_team FROM prediction p, users u, teams t, `match` m where p.playerID = " + playerID + " and u.userid = p.playerID and t.teamID = p.predictedTeamID and m.matchID = p.matchID and m.isActive=0",
  { type: sqlConn.QueryTypes.SELECT })
    .then(function (matches) {
        
        //fill response object and return
        resObj.success = true;
        resObj.count = matches.length;
        
        for (var n = 0; n < matches.length; n++) {
            
            var outcome = (matches[n].predicted_team == matches[n].winning_team)?"WIN":"LOSS";
            resObj.historyData.push({
                team1Name: matches[n].team1,
                team2Name: matches[n].team2,
                matchDate: matches[n].match_date,
                predictedTeam: matches[n].predicted_team,
                winningTeam: matches[n].winning_team,
                result: outcome
            });
        }
        //console.log("\n&&&&&USER_HISTORY::\n"+JSON.stringify(resObj)+"\n&&&&&&&&&\n");
        res.json(resObj);
        res.end();
        return;
    })
  .catch(function (err) {
        //match find failed. Reply with message
        utils.logMe("Error trying to fetch user match history. Details:\n" + err);
        resObj.success = false;
        resObj.message = err;
        
        res.json(resObj);
        res.end();
        return;
    })
})

//try to login and get user info API
app.post("/api/login", function (req, res) {
    
    var resObj = {
        usrData: {},
        message: "",
        success: false
    };
    
    if (req.body.email == "" || req.body.password == "") {
        resObj.message = "Invalid email/password";
        resObj.success = false;
    }
    Users.find({
        where: {
            email: req.body.email,
            password: req.body.password
        }
    })
  .then(function (usrObj) {
        
        if (usrObj == null) {
            throw "User not found. Please check username/password and try again";
        }
        
        //populate user data
        resObj.success = true;
        resObj.usrData = {
            userID: usrObj.userID,
            email: usrObj.email,
            user: usrObj.name,
            points: usrObj.points
        };
        
        res.json(resObj);
        res.end();
        return;
    })
  .catch(function (err) {
        //user find failed
        utils.logMe("Error trying to fetch user with email " + req.body.email + "Details: \n" + err);
        resObj.success = false;
        resObj.message = err;
        
        res.json(resObj);
        res.end();
        return;
    });
});

//add new user API
app.post("/api/adduser", function (req, res) {
    
    //Password hashing has been taken care of on the client side
    if (req.body.name == "" || req.body.email == "" || req.body.password == "") {
        utils.logMe("Blank values trying to add user. Not registering");
        return;
    }
    
    var user = Users.build({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        points: 0
    });
    
    user.save()
    .then(function () {
        res.end();
        return;
    })
    .catch(function (err) {
        console.log("Error adding user {" + req.body.name + "/" + req.body.email + "/" + "}. Details: \n" + err + ")");
        res.end();
        return;
    });
});

//update prediction table with user's submission
app.post("/api/submitPrediction", function (req, res) {
    //adding user prediction to the database
    
    var resObj = {
        message: "",
        success: false
    };
    
    //since userID and matchID are composite keys, it throws exception if user submits twice
    for (var c = 0; c < req.body.length; c++) {
        var prediction = Prediction.build({
            playerID: req.body[c].userID,
            matchID: req.body[c].matchID,
            predictedTeamID: req.body[c].teamID
        });
        
        prediction.save()
    .then(function () {
            resObj.success = true;
        })
    .catch(function (err) {
            resObj.success = false;
            resObj.message = err;
            utils.logMe("Error trying to save prediction information. Details: \n" + err);
        });
    }
    
    res.json(resObj);
    return;
});


/*=====================================Init app=====================================*/

app.listen(port);

utils.logMe("PredictSoft v2.00 started on port " + port);