/*
grjoshi 3/10/2016
Controller that handles 
	- loading up poll page, with team names
*/
(function () {
    angular.module("psoft2UI").controller("gameController", pollCtrl);
    pollCtrl.$inject = ['$scope', '$location', 'userService', 'gameService'];
    
    function pollCtrl($scope, $location, userService, gameService) {
        
        $scope.games = [];
        $scope.selection = [];				//array of {usrID, matchID, teamID} objects			
        $scope.predErr = false;				//flag showing error if all selections aren't made	
        $scope.nogames = false;				//flag to show message if no games are available
        
        $scope.user_token = userService.usrObj.token;
        
        $scope.showConfirmation = false;
        
        $scope.lockDown = false;
        
        //	$scope.isPointsTableLoaded = false;
        $scope.scoreGrid = {
            columnDefs: [{ field: 'Name', displayName: 'Name' },
                { field: 'Points', displayName: 'Score', width: 100 }]
        };
        
        $scope.predictionGrid = {
            columnDefs: [{ field: 'Name', displayName: 'Name' },
                { field: 'Team', displayName: 'Predicted Team' }]
        };
        
        $scope.hasPredicted = true;
        
        var getLeaderBoard = function () {
            
            //get Points from API
            gameService.getUserPoints()
			.then(function (response) {
                if (response == null) {
                    throw "There was an error trying to connect to the web service. Please try again later";
                }
                if (!response.data.success) { throw response.data.message; }
                if (response.data.scoreData.length == 0) {
                    $scope.scoreGrid = { data: '' };
                }
                else {
                    //console.log(angular.toJson(response.data.scoreData,true));
                    $scope.scoreGrid.data = response.data.scoreData;
                }
            })
			.catch(function (err) {
                console.log("Unable to fetch score table. Details:\n" + err)
            })
        }
        
        var getPredictionTable = function () {
            
            //quick hack for semi and finals:
            if ($scope.lockDown) {
                $scope.predictionGrid = { data: '' };		//comment to show prediction grid 
                return;
            }
            
            //get Prediction from API
            gameService.getPredictionList()
			.then(function (response) {
                if (response == null) {
                    throw "There was an error trying to fetch prediction data from the web service. Please try again later";
                }
                if (!response.data.success) { throw response.data.message; }
                if (response.data.predictData.length == 0) {
                    $scope.lockDown = true;
                    $scope.predictionGrid = { data: '' };
                }
                else {
                    $scope.predictionGrid.data = response.data.predictData;
                }
            })
			.catch(function (err) {
                console.log("Unable to fetch prediction table. Details:\n" + err)
            })
        }
        
        if (!userService.checkLogin()) {
            //user not logged in
            $location.path("/login");
        }
        else {
            getLeaderBoard();			//load score table
            getPredictionTable();		//load prediction table
            
            //check if user has already predicted
            gameService.checkIfUserPredicted($scope.user_token)
			.then(function (response) {
                
                //console.log("%%"+angular.toJson(response));
                $scope.hasPredicted = response.data.hasPredicted;
                //console.log("@@$cope.hasPredicted ="+$scope.hasPredicted);
                if (!$scope.hasPredicted) {
                    //only load if game has not been predicted for this user
                    
                    //get next game item by calling API function
                    gameService.getNextGame()
						.then(function (response) {
                        if (response == null) {
                            throw "There was an error trying to connect to the web service. Please try again later";
                        }
                        
                        if (!response.data.success) {
                            throw response.data.message;
                        }
                        
                        if (response.data.matchData.length == 0) {
                            $scope.nogames = true;
                        }
                        else {
                            $scope.games = response.data.matchData.slice();		//copy games info to scope
                            $scope.nogames = false;
                        }
                        
                        return;
                    })
						.catch(function (err) {
                        console.log("ERROR: " + err);
                        return;
                    })
                }
            })
			.catch(function (err) {
                console.log(err);
                return;
            })
        }
        
        
        $scope.submitPoll = function () {
            //submit prediction data to the server
            
            //check if all matches have been predicted
            if ($scope.games.length != $scope.selection.length) {
                $scope.predErr = true;
                return;
            }
            else {
                //try submitting
                $scope.predErr = false;
                gameService.submitPrediction(userService.usrObj.token,$scope.selection)
			.then(function (response) {
                    if (response == null) {
                        throw "There was an error trying to send the prediction data. Please try again later";
                    }
                    
                    /*				if(!response.data.success)
				{
					if(!response.data.message)
						throw response.data.message;
				}
*/
				//console.log("Prediction added to DB. Now is a good place to show summary or success page");
				$scope.showConfirmation = true;
                    //$location.path("/summary");
                    return;
                })
			.catch(function (err) {
                    $scope.message = err;
                    $scope.is_valid = false;
                    console.log(err);
                })
            }
        };
        
        //add each match's predictions inside a JSON object, to send back to server
        $scope.selectTeam = function (matchID, teamID) {
            
            var doAdd = true;
            //builds the array to submit prediction data		
            $scope.selection.some(function (e) {
                //check if matchID key already exists and clear if so
                if (e.matchID === matchID) {
                    //Existing item found, updating with new selection
                    //e.userID = userService.usrObj.userID;//$scope.userID;
                    e.teamID = teamID;
                    doAdd = false;
                    return;
                }
            })
            
            if (doAdd) {
                $scope.selection.push(
                    {
                        //userID: userService.usrObj.userID,
                        matchID: matchID,
                        teamID: teamID
                    });
            }
            return;
        }

    }
})();