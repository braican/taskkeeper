(function(){
    var app = angular.module('taskkeeper', ["firebase"]);

    var ref = new Firebase("https://taskkeeper.firebaseio.com/Clients");

    /**
     * ClientController
     */
    app.controller("ClientController", ["$firebaseObject", function( $firebaseObject ){
        var self = this;

        // download the data into a local object
        self.clients = $firebaseObject(ref);

        self.tab = 'EDF';

        self.task = {};

        self.selectClient = function(clientName){
            self.tab = clientName;
        };

        self.isSelected = function( clientName ){
            return self.tab === clientName;
        }

        self.addTask = function( clientName ){

            if( ! self.clients[ clientName ].tasks ){
                self.clients[ clientName ].tasks = [self.task];
            } else {
               self.clients[ clientName ].tasks.push( self.task ); 
            }

            saveData();

            self.task = {};
        }

        self.totalHours = function( client ){

            var tasks = client.tasks,
                total = 0;

            if( ! tasks ){
                return total;
            }

            angular.forEach( tasks, function(task, index){
                total += task.hours;
            });

            return total;
        }

        self.totalDue = function( client ){
            var hours = self.totalHours( client );
            return hours * client.hourlyRate;
        }

        self.editTask = function(clientName, taskId){
            console.log(taskId);
        }
        self.removeTask = function(clientName, taskId){
            
            var removed = self.clients[clientName].tasks.splice(taskId, 1);

            saveData();
        }


        function saveData( ){
            self.clients.$save().then(function(r){
                r.key() === self.clients.$id;
            }, function(error){
                console.log("Error: " + error);
            });
        }
    } ]);


})();