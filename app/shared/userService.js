
angular.module("psoft2UI").service("userService",function($http){
	//console.log("Starting user auth service");
	this.usrObj = {
		userID: '',
		email: '',
		name: '',
        token: '',
		points: 0
	};	

	this.checkLogin=function(){
		if(this.usrObj.token=='')			//use token to check if user is logged in
			return false;
		else
			return true;
	}

	this.login= function(email,password){
      	var data = {
      		email: email,
      		password: password
      	};

      	var promise = $http.post("/api/login",data);
      	return promise;
  	}

  	this.addUser = function(fname,email,password){
  		
		var data = {
			name: fname,
			email: email,
			password: password
		};

  		var promise = $http.post("/api/adduser", data);
  		return promise;
  	}

	this.getPredictionHistory = function(userID){
		//console.log("Getting prediction history for userID: "+userID);
		var promise = $http.get("/api/getHistory?userID="+userID);
		return promise;
	}


});
