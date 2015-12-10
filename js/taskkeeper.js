//
// - angular codes
//
(function( TASKKEEPER ){
    var app = angular.module('taskkeeper', ["firebase"]);

    var ref = new Firebase("https://taskkeeper.firebaseio.com/Clients");

    /**
     * ClientController
     */
    app.controller("TaskkeeperController", ["$firebaseObject", function( $firebaseObject ){
        var self = this;

        self.loaded = false;

        // download the data into a local object
        self.clients = $firebaseObject(ref);

        self.clients.$loaded().then(function(){
            self.loaded = true;
        }).catch(function(err){
            console.error("Error: " + err);
        });

        // the tab to start on
        self.tab = localStorage.getItem('activeClient') ? localStorage.getItem('activeClient') : '';

        // is the drawer active
        self.drawerActive = false;

        // is the new client form active
        self.newClientActive = false;

        // are we editing a given task?
        self.editingTask = false;

        // a localized task object to use as the blank task template
        self.task = {};

        self.newClient = {};


        /**
         * select this client, and display all their info
         *
         * @param clientName (string)
         *   - the client to select
         */
        self.selectClient = function(clientName){
            self.tab = clientName;
            localStorage.setItem('activeClient', clientName);
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
         * add a new client
         */
        self.addClient = function(){

            if( !self.newClient.hourlyRate ){
                self.newClient.hourlyRate = 0;
            }

            self.clients[ self.newClient.clientName ] = {
                hourlyRate: self.newClient.hourlyRate
            };

            saveData();

            self.newClient = {};
            self.newClientActive = false;
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
            self.editingTask = taskId;
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


        /**
         * save the currently edited task
         */
        self.saveTask = function(){
            saveData();
            self.editingTask = false;
        }


        /**
         * indicate that we're waiting on an invoice from a client
         *
         * @param clientName (string)
         *   - the client we're waiting on
         */
        self.waitingOnInvoice = function( clientName ){

            if( !self.clients[clientName].tasks ){
                return;
            }

            var invoicedTasks = [],
                heldTasks     = [];

            for(var i = 0; i < self.clients[clientName].tasks.length; i++){
                console.log("test");
            }

            angular.forEach( self.clients[clientName].tasks, function( task, index ){
                if(! task.hold){
                    invoicedTasks.push( task );
                } else {
                    heldTasks.push(task);
                }
            } );
            
            self.clients[clientName].tasks = heldTasks;
            self.clients[clientName].invoicedTasks = invoicedTasks;
            self.clients[clientName].outstandingInvoice = true;

            saveData();
        }


        /**
         * check off that an invoice has been paid, so archive the
         *  paid tasks and reset the invoice thing
         *
         * @param clientName (string)
         *   - the client that just paid
         */
        self.paidInvoice = function( clientName ){

            self.clients[clientName].outstandingInvoice = false;

            if( self.clients[clientName].invoicedTasks ){
                var today       = new Date(),
                    dd          = today.getDate(),
                    mm          = today.getMonth() + 1,
                    yy          = today.getFullYear(),
                    tasks       = self.clients[clientName].invoicedTasks,
                    archiveTask = {
                        invoiceDate : mm + '/' + dd + '/' + yy,
                        tasks       : tasks
                    };   

                if( self.clients[clientName].taskArchive ){
                    self.clients[clientName].taskArchive.push(archiveTask);
                } else {
                    self.clients[clientName].taskArchive = [archiveTask];
                }
                delete self.clients[clientName].invoicedTasks;
            }
            
            saveData();
        }


        /**
         * cancel the given invoices
         *
         * @param clientName (string)
         *   - the client that just paid
         */
        self.cancelInvoice = function(clientName){
            
            self.clients[clientName].outstandingInvoice = false;

            if( self.clients[clientName].invoicedTasks ){
                var tasks = self.clients[clientName].invoicedTasks;

                if( self.clients[clientName].tasks ){
                    var newTasks = self.clients[clientName].tasks.concat( tasks );
                    self.clients[clientName].tasks = newTasks;
                } else {
                    self.clients[clientName].tasks = tasks;
                }

                delete self.clients[clientName].invoicedTasks;
            }

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


    app.filter('activeProject', function(){
        return function( items ){
            var result = {};
            angular.forEach(items, function(value, key) {
                if( ( value.tasks && value.tasks.length > 0 ) || value.outstandingInvoice ){
                    result[key] = value;
                };
            });
            return result;
        };
    });
    app.filter('inactiveProject', function(){
        return function( items ){
            var result = {};
            angular.forEach(items, function(value, key) {
                if( ! ( ( value.tasks && value.tasks.length > 0 ) || value.outstandingInvoice ) ){
                    result[key] = value;
                };
            });
            return result;
        };
    });


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