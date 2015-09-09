(function(){
    var app = angular.module('taskkeeper', []);
    Parse.initialize("eqWRtTyxO7URAQU5ExyWkbg2D3VAeyN05O59xYAY", "xPAmUBGaDB5mkC876RW39gG4WDTeTfVC5oc4iwzU");

    var Clients = Parse.Object.extend("Client");
    var query = new Parse.Query(Clients);

    query.find({
        success: function(results){
            console.log(results[0].get('hourlyRate'));
        }
    });

})();