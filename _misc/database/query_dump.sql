SET @tokenID := 'c18f3475482c59f2bde584676deaf31c';


/*get list of upcoming games */
SELECT  match.matchID as matchID, team1.teamID as t1ID,team1.name as t1Name, team2.teamID as t2ID,team2.name as t2Name,match.isLocked as locked, match.MatchDate as date FROM `match` LEFT JOIN (teams as team1, teams as team2) ON (team1.teamID = `match`.Team1ID AND team2.teamID = `match`.Team2ID) WHERE isActive=1;


/* get predictions for all users except logged in user */
SELECT u.name as name, (SELECT Name FROM teams WHERE teamID = p.predictedTeamID) As PredictedTeam FROM prediction p, users u WHERE p.playerID = u.userID AND u.userID NOT IN (SELECT userID from users where auth_key = @tokenID) AND p.matchID IN ( SELECT matchID FROM `match` WHERE isActive =1 AND isHidden=0);


/* get predictions for user with tokenID */
SELECT * FROM prediction p WHERE playerID = (SELECT userID FROM users WHERE auth_key = @tokenID) AND matchID IN (SELECT matchID FROM `match` WHERE isActive = 1);

