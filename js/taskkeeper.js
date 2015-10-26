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

    var clientsData = [{
        name               : "Christa Bianchi",
        hourlyRate         : 52,
        outstandingInvoice : true,
        tasks              : [{
            description : "Adding mobile navigation",
            hours       : 4
        },{
            description : "Active state for main navigation",
            hours       : 2
        },{
            description : "Thumbnails fade in",
            hours       : 3.5
        }]
    },{
        name       : "EDF",
        hourlyRate : 45,
        tasks      : []
    }];

    app.controller("ClientController", function(){
        this.clients = clientsData;

        this.tab;

        this.selectClient = function(clientName){
            this.tab = clientName;
        };

        this.isSelected = function( clientName ){
            return this.tab === clientName;
        }
    });

})();