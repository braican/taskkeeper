App = Ember.Application.create();

var data = [{
    id: "1",
    name: "Buddy Allen Management",
    rate: 30,
    waiting: false,
    line_items: {
        fixed: [{
            description: "buying Futura",
            cost: 25,
            paid: false
        }],
        hourly: [{
            description: "mobilizing the adam jensen website",
            hours: 4,
            paid: false
        }, {
            description: "new splash page",
            hours: 1,
            paid: false
        }]
    }
}, {
    id: "2",
    name: "EDF",
    rate: 0,
    waiting: true,
    line_items: {
        fixed: [{
            description: "invoice at first half",
            cost: 925,
            paid: false
        },{
            description: "purchasing the ACF Repeater plugin",
            cost: 25,
            paid: false
        }],
        hourly:[]
    }
}];


App.Router.map(function(){
    this.resource('about');
    this.resource('clients', {path: '/'}, function(){
        this.resource('client', { path: ':client_id' });
    });
    
});

App.ClientsRoute = Ember.Route.extend({
    model: function(){
        return data;
    }
});

App.ClientRoute = Ember.Route.extend({
    model: function(params){
        return data.findBy('id', params.client_id);
    }
});

App.ClientController = Ember.ObjectController.extend({
    isEditingClient: false,

    actions:{
        edit: function(){
            this.set('isEditingClient', true);
        },

        doneEditing: function(){
            this.set('isEditingClient', false);
        }
    }
});

