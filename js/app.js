App = Ember.Application.create();

var data = [{
    id: "1",
    name: "Buddy Allen Management",
    rate: 30,
    waiting: false,
    line_items: {
        fixed: [{
            id:"1",
            description: "buying Futura",
            cost: 25,
            paid: false
        }],
        hourly: [{
            id:"2",
            description: "mobilizing the adam jensen website",
            hours: "4",
            paid: false
        }, {
            id:"3",
            description: "new splash page",
            hours: "1",
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
            id:"1",
            description: "invoice at first half",
            cost: 925,
            paid: false
        },{
            id:"2",
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


Ember.Handlebars.helper('hourlySubtotal', function(hrs){
    var rate = 30;
    // console.log($('#the-rate'));
    // console.log(hrs);
    // console.log(this);
    return hrs * rate;
});

Ember.Handlebars.helper('totalDue', function(){
    var rate = this.content.rate,
        totalDue = 0;

    $.each(this.content.line_items.hourly, function(index, val) {
        totalDue += (val.hours * rate);
    });

    $.each(this.content.line_items.fixed, function(index, val) {
        totalDue += val.cost;
    });

    console.log(totalDue);
    // console.log(hrs);
    // console.log(this);
    return totalDue;
});
