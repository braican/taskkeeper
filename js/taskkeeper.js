(function(){
    var app = angular.module('taskkeeper', []);

    // Parse.initialize("eqWRtTyxO7URAQU5ExyWkbg2D3VAeyN05O59xYAY", "xPAmUBGaDB5mkC876RW39gG4WDTeTfVC5oc4iwzU");

    // var Clients = Parse.Object.extend("Client");
    // var query = new Parse.Query(Clients);

    // query.find({
    //     success: function(results){
    //         angular.forEach(results, function(result, key){
    //             var clientName = result.get('name'),
    //                 hourlyRate = result.get('hourlyRate');
    //         });
    //     }
    // });

    /**
     * ClientController
     */
    app.controller("ClientController", ['$http', function($http){
        var self = this;

        self.clients = {};
        self.tab = 'EDF';

        $http.get('data/clients.json').success(function(data){
            self.clients = data;
        });

        this.selectClient = function(clientName){
            this.tab = clientName;
        };

        this.isSelected = function( clientName ){
            return this.tab === clientName;
        }
    } ]);


    /**
     * TaskController
     *
     *  - the form for adding/editing tasks for a client
     */
    app.controller("TaskController", function(){
        this.task = {};

        this.addTask = function( client ){

            client.tasks.push( this.task );

            this.task = {};
        }

    });

})();