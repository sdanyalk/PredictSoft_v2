(function () {
    angular.module("psoft2UI").controller("addUserController", addUserCtrl);
    addUserCtrl.$inject = ['$scope', '$location', 'userService', 'md5'];
    
    function addUserCtrl($scope, $location, userService, md5) {
        
        
        $scope.is_pass_match = true;
        $scope.is_processing = false;
          
        $scope.registerUser = function () {
            
            if ($scope.user.name == "" || $scope.user.email == "" || $scope.user.password == "") {
                console.log("DBG::BLANK VALUES CANNOT BE SUBMITTED");
                return;
            }
            
            if ($scope.user.password == $scope.user.confirm_password)
                $scope.is_pass_match = true;
            else {
                $scope.is_pass_match = false;
                //console.log("PASSWORDS DO NOT MATCH");
                return;
            }
            
            //TODO: check if email already exists
            
            $scope.is_processing = true;            //processing GIF            
            
            
            console.log("NOT ADDING FOR NOW");
            return;
            
            console.log("HWUHUHWU");    

            //call service and wait for response
            userService.addUser($scope.user.name,'', $scope.user.email, md5.createHash($scope.user.password))			//TODO: remove last name field requirement from server API function
			.then(function (response) {
                console.log("Added new user");
            })
			.catch(function (response) {
                console.log("FAILED adding user. Response was:" + response.status, response.data);
            })
			.finally(function () {
                console.log("ADDUSER: All done, one way or another");
                $location.path("/");
            })
        }
    }
})();