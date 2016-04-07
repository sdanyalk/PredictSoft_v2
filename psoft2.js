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
        "SELECT team1.teamID as t1ID,team1.name as t1Name,team1.groupID as t1Group, team2.teamID as t2ID,team2.name as t2Name, team2.groupID as t2Group, match.matchID as matchID, match.isLocked as locked, match.MatchDate as date FROM `match` LEFT JOIN (teams as team1, teams as team2) ON (team1.teamID = `match`.Team1ID AND team2.teamID = `match`.Team2ID) WHERE isActive=1",
        { type: sqlConn.QueryTypes.SELECT })
        .then(function (matches) {
        //fill response object and return
        resObj.success = true;
        resObj.count = matches.length;
        
        for (var n = 0; n < matches.length; n++) {
            
            //TODO: update query to also select current predictions for user            
            
            resObj.matchData.push({
                matchID: matches[n].matchID,
                team1ID: matches[n].t1ID,
                team1Name: matches[n].t1Name,
                //team1Group: matches[n].t1Group,
                team2ID: matches[n].t2ID,
                team2Name: matches[n].t2Name,
                //team2Group: matches[n].t2Group,
                locked: (matches[n].locked == 0)?false:true,        //this will enable/disable prediction for particular match
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
    
    var tokenID = req.query.token;
    
    sqlConn.query(
        "SELECT * FROM prediction p WHERE playerID = (SELECT userID FROM users WHERE auth_key = '" + tokenID + "') AND matchID IN (SELECT matchID FROM `match` WHERE isActive = 1)",
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
    
    var playerToken = req.query.token;
    
    sqlConn.query(
        "SELECT m.MatchDate as match_date,(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team1ID) as team1,(SELECT teams.Name FROM teams WHERE teams.teamID = m.Team2ID) as team2,(SELECT teams.Name FROM teams WHERE teams.teamID = p.predictedTeamID) as predicted_team,(SELECT teams.Name FROM teams WHERE teams.teamID = m.WinningTeamID) as winning_team FROM prediction p, users u, teams t, `match` m where p.playerID = (SELECT playerID FROM users WHERE auth_key = '" + playerToken + "' ) and u.userid = p.playerID and t.teamID = p.predictedTeamID and m.matchID = p.matchID and m.isActive=0",
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
            token: usrObj.auth_key,
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
        utils.logMe("Blank values trying to add user(email given: " + req.body.email + "). Not registering!");
        return;
    }
    
    var resObj = {
        message: "",
        success: false
    };
    
    
    //check if email ID already exists
    Users.find({
        where: {
            email: req.body.email,
        }
    }).then(function (usrObj) {
        if (usrObj == null) {
            //email has not been taken; add this user
            var user = Users.build({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                auth_key: req.body.token,
                points: 0
            });
            
            user.save()
            .then(function () {
                resObj.success = true;
                res.json(resObj);
                return;
            })
            .catch(function (err) {
                utils.logMe("Error adding user {" + req.body.name + "/" + req.body.email + "/" + "}. Details: \n" + err + ")");
                resObj.success = false;
                resObj.message = err;
                res.json(resObj);
                return;
            });
        }
        else {
            throw "That email address has already been registered.";
        }
    })
    .catch(function (err) {
        utils.logMe("[" + req.body.email + "]" + err);
        resObj.success = false;
        resObj.message = err;
        res.json(resObj);
        return;
    });
});


app.post("/api/submitPrediction", function (req, res) {
    
    var resObj = {
        message: "",
        success: false
    };
    
    //utils.logMe("predObj::" + JSON.stringify(req.body.predObj));
    var rows = req.body.predObj.length;
    var userID = 0;
    var team_id = 0;
    var match_id = 0;
    var team_id2 = 0;
    var match_id2 = 0;
    
    sqlConn.query(
        "SELECT userID from users WHERE auth_key = '" + req.body.token + "'",
    { type: sqlConn.QueryTypes.SELECT })
    .then(function (user_row) {
        
        userID = user_row[0].userID;
        team_id = req.body.predObj[0].teamID;
        match_id = req.body.predObj[0].matchID;
        return Prediction
                .findOrCreate({ where: { playerID: userID, matchID: match_id }, defaults: { predictedTeamID: team_id } })
                .spread(function (prediction, created) {
            if (!created) {
                //utils.logMe("TEAMID INSIDE findOrCreate is: " + team_id);
                utils.logMe("EXISTING prediction object:" + JSON.stringify(prediction));
                
                //prediction exists; update it
                sqlConn.query(
                    "UPDATE prediction SET predictedTeamID=" + team_id + " WHERE playerID=" + userID + " AND matchID=" + match_id,
                        { type: sqlConn.QueryTypes.UPDATE })
                        .then(function (updated) {
                    utils.logMe("Updated for user " + userID + " for matchID: " + match_id + "; new team: " + team_id);
                    resObj.success = true;
                })
            }
            else {
                //new row has been created
                utils.logMe("New row has been created for user " + userID + " for matchID: " + match_id + "; new team: " + team_id);
                resObj.success = true;
            }
        });
        return resObj;
    })
    .then(function () {
        //utils.logMe("userID from second row is: " + userID);
        if (rows > 1) {
            //update second game if exists
            team_id2 = req.body.predObj[1].teamID;
            match_id2 = req.body.predObj[1].matchID;
            return Prediction
                    .findOrCreate({ where: { playerID: userID, matchID: match_id2 }, defaults: { predictedTeamID: team_id2 }})
                    .spread(function (prediction2, created) {
                if (!created) {
                    //utils.logMe("TEAMID INSIDE findOrCreate is: " + team_id2);
                    utils.logMe("EXISTING prediction object:" + JSON.stringify(prediction2));
                    
                    //prediction exists; update it
                    sqlConn.query(
                        "UPDATE prediction SET predictedTeamID=" + team_id2 + " WHERE playerID=" + userID + " AND matchID=" + match_id2,
                            { type: sqlConn.QueryTypes.UPDATE })
                            .then(function (updated2) {
                        //utils.logMe("Updated for user " + userID + " for matchID: " + match_id2 + "; new team: " + team_id2);
                        resObj.success = true;
                    })
                }
                else {
                    //new row has been created
                    utils.logMe("New row has been created for user " + userID + " for matchID: " + match_id2 + "; new team: " + team_id2);
                    resObj.success = true;
                }
            });
        }
        return resObj;
    })
});

/*=====================================Init app=====================================*/

app.listen(port);

utils.logMe("PredictSoft v2.00 started on port " + port);