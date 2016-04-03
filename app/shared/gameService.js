/*
grjoshi 3/30/2016
     Service to handle all game-related API calls
*/

angular.module("psoft2UI").service("gameService", function ($http) {
    
    this.getNextGame = function () {
        var promise = $http.get("/api/nextmatch");
        return promise;
    }
    
    this.submitPrediction = function (predObj) {
        var promise = $http.post("/api/submitPrediction", predObj);
        return promise;
    }
    
    this.showNextGamePredictions = function () {
        var promise = $http.get("/api/getPredictions");
        return promise;
    }
    
    this.getUserPoints = function () {
        var promise = $http.get("/api/getScores");
        return promise;
    }
    
    this.getPredictionList = function () {
        var promise = $http.get("/api/getPredictions");
        return promise;
    }
    
    this.checkIfUserPredicted = function (userID) {
        var promise = $http.get("/api/checkIfPredicted?userID=" + userID);
        return promise;
    }
});