SET @tokenID := 'c18f3475482c59f2bde584676deaf31c';

/* get predictions for all users except logged in user */
SELECT u.name as name, (SELECT Name FROM teams WHERE teamID = p.predictedTeamID) As PredictedTeam FROM prediction p, users u WHERE p.playerID = u.userID AND p.matchID IN ( SELECT matchID FROM `match` WHERE isActive =1 AND isHidden=0);


/* get predictions for user with tokenID */
SELECT * FROM prediction p WHERE playerID = (SELECT userID FROM users WHERE auth_key = @tokenID) AND matchID IN (SELECT matchID FROM `match` WHERE isActive = 1);

