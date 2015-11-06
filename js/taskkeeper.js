//
// - angular codes
//
(function( TASKKEEPER ){
    var app = angular.module('taskkeeper', ["firebase"]);

    var ref = new Firebase("https://taskkeeper.firebaseio.com/Clients");

    /**
     * ClientController
     */
    app.controller("ClientController", ["$firebaseObject", function( $firebaseObject ){
        var self = this;

        // download the data into a local object
        self.clients = $firebaseObject(ref);

        // the tab to start on
        self.tab = 'EDF';

        // is the drawer active
        self.drawerActive = false;

        // a localized task object to use as the blank task template
        self.task = {};


        /**
         * select this client, and display all their info
         *
         * @param clientName (string)
         *   - the client to select
         */
        self.selectClient = function(clientName){
            self.tab = clientName;
        };


        /**
         * check to see if the given clientName is the active one
         *
         * @param clientName (string)
         *   - the client that we're checking is active
         */
        self.isSelected = function( clientName ){
            return self.tab === clientName;
        }


        /**
         * add a new task
         *
         * @param clientName (string)
         *   - the client to add the new task to
         */
        self.addTask = function( clientName ){

            if( !self.task.hours ){
                self.task.hours = 0;
            }

            if( ! self.clients[ clientName ].tasks ){
                self.clients[ clientName ].tasks = [self.task];
            } else {
               self.clients[ clientName ].tasks.push( self.task ); 
            }

            saveData();

            self.task = {};
        }


        /**
         * gets the total number of hours worked
         *
         * @param client (object)
         *   - the client information
         */        
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


        /**
         * gets the total amount due
         *
         * @param client (object)
         *   - the client information
         */
        self.totalDue = function( client ){
            var hours = self.totalHours( client );
            return hours * client.hourlyRate;
        }


        /**
         * edit the clicked task
         *
         * @param clientName (string)
         *   - the name of the client whose tasks we're editing
         *
         * @param taskId (number)
         *   - the ID (from firebase) of the task we're editing
         */
        self.editTask = function(clientName, taskId){
            console.log(taskId);
        }


        /**
         * remove the clicked task
         *
         * @param clientName (string)
         *   - the name of the client whose tasks we're removing
         *
         * @param taskId (number)
         *   - the ID (from firebase) of the task we're removing
         */
        self.removeTask = function(clientName, taskId){
            
            var removed = self.clients[clientName].tasks.splice(taskId, 1);

            saveData();
        }


        /* --------------------------------------------
         * --util
         * -------------------------------------------- */


        /**
         * utility function that saves the data back to firebase
         */
        function saveData( ){
            self.clients.$save().then(function(r){
                r.key() === self.clients.$id;
            }, function(error){
                console.log("Error: " + error);
            });
        }
    } ]);


})( window.TASKKEEPER = window.TASKKEEPER || {});



//
// --load the svg sprites
//
(function( TASKKEEPER ){

    /**
     * load the svg sprite into the top of the page
     */
    function loadSvgSprite(){
        var request = new XMLHttpRequest();
        var spriteDiv = document.getElementById("tk-svg-sprite");

        request.open('GET', 'svg/build/icons.svg', true);

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                var resp = this.response;
                spriteDiv.innerHTML = resp;
            } else {
                console.error("There was an error getting the icons");
            }
        };

        request.onerror = function() {
            console.error("There was an error getting the icons");
        };

        request.send();
    }

    
    //
    // --DOM READY
    //
    document.addEventListener("DOMContentLoaded", function(event) { 
        loadSvgSprite();
    });

})( window.TASKKEEPER = window.TASKKEEPER || {} );