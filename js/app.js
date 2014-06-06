App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();
// var data = [{
//     id: "1",
//     name: "Buddy Allen Management",
//     rate: 30,
//     isOwed: false,
//     line_items: {
//         fixed: [{
//             id:"1",
//             description: "buying Futura",
//             cost: 25,
//             paid: false
//         }],
//         hourly: [{
//             id:"2",
//             description: "mobilizing the adam jensen website",
//             hours: "4",
//             paid: false
//         }, {
//             id:"3",
//             description: "new splash page",
//             hours: "1",
//             paid: false
//         }]
//     }
// }, {
//     id: "2",
//     name: "EDF",
//     rate: 0,
//     isOwed: true,
//     line_items: {
//         fixed: [{
//             id:"1",
//             description: "invoice at first half",
//             cost: 925,
//             paid: false
//         },{
//             id:"2",
//             description: "purchasing the ACF Repeater plugin",
//             cost: 25,
//             paid: false
//         }],
//         hourly:[]
//     }
// }];

App.Client = DS.Model.extend({
    name: DS.attr('string'),
    invoiced: DS.attr('boolean'),
    moneyDue: DS.attr('number'),
    dueDate: DS.attr('date'),
    hourlyRate: DS.attr('number')
});

App.Client.FIXTURES = [{
   id: 1,
   name: 'Buddy Allen Management',
   invoiced: false,
   moneyDue: 0,
   dueDate: null,
   hourlyRate: 25
},{
   id: 2,
   name: 'EDF',
   invoiced: false,
   moneyDue: 120,
   dueDate: new Date('2014/06/09'),
   hourlyRate: null
},{
   id: 3,
   name: 'Brooklyn Boulders',
   invoiced: true,
   moneyDue: 1160,
   dueDate: new Date('2014/06/06'),
   hourlyRate: null
}];


App.Router.map(function(){
    this.resource('clients', {path: '/'}, function(){
        this.resource('client', { path: ':client_id' });
    });
});

App.ClientsRoute = Ember.Route.extend({
    model: function(){
        // return data;
        return this.store.find('client');
    }
});


//
// controllers
//

App.ClientsController = Ember.ArrayController.extend({
    actions: {
        createClient: function(){
            var name = this.get('newClient');

            console.log(this);
            if(!name.trim()){return;}

            var client = this.store.createRecord('client', {
                name: name,
                invoiced: false,
                moneyDue: 0,
                dueDate: null,
                hourlyRate: null
            });

            this.set('newClient', '');

            client.save();
        }
    }
});


App.ClientController = Ember.ObjectController.extend({

    invoiced: function(key, value){
        var model = this.get('model');

        if(value === undefined){
            return model.get('invoiced');
        } else {
            model.set('invoiced', value);
            model.save();
            return value;
        }
    }.property('model.invoiced'),

    actions: {
        editName: function(){
            this.set('isEditing', true);
        },

        acceptChanges: function(){
            this.set('isEditing', false);

            this.get('model').save();
        }
    },

    isEditing: false
    
});


//
// views
//

App.EditNameView = Ember.TextField.extend({
    didInsertElement: function(){
        this.$().focus();
    }
});

//
// handlebars helpers
//
Ember.Handlebars.helper('edit-name', App.EditNameView);


Ember.Handlebars.helper('parseDate', function(date){
    console.log(date);
    return date ? date.toDateString() : '';
});

