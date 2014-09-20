/**
 * Created by Nir on 9/7/2014.
 */

window.App =  Ember.Application.create();

window.odometerOptions = {
    duration: 300 // Change how long the javascript expects the CSS animation to take
};


App.ApplicationView = Ember.View.extend({
  classNames: ['app-view-wrapper']
});

App.Store = DS.Store.extend();

App.ApplicationAdapter = DS.FixtureAdapter.extend();

var odometerValue = 0;

function bindTextUpdate(){

    $("#movie-name-input").keydown(function(e){
        var value = this.value;
        if(e.keyCode == "8" && value.length == 2) {
            this.value = "";
        } else {

            //todo: handle cursor position problem

            // Ensure that it is a number and stop the keypres
            if ((e.shiftKey || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            } else if(value[0] != "$") {
                $(this).val("$" + value);
            }
        }
    });
}

function initDailyPilot(model) {
    App.dp = new DayPilot.Calendar("dp");

    var dp = App.dp;
    dp.theme = "calendar_green";
    dp.viewType = "Week";

    var totalHours = 0;

    dp.eventDeleteHandling = "Update";
    dp.onTimeRangeSelected = function (args) {
        dp.clearSelection();
        var e = new DayPilot.Event({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            resource: args.resource,
            text: "",
            hours: (args.end.ticks - args.start.ticks) / 1000 / 60 / 60
        });
        dp.events.add(e);

        $(".calendar_green_event_inner").not(".marked")
            .html("<div class='close'>x</div>")
            .addClass("marked")
            .children().click(function(){
                dp.events.remove(e);
                totalHours -= e.data.hours;
                model.set("hours",totalHours);
                e = null;
            });

        totalHours += e.data.hours;
        model.set("hours",totalHours);
    };

    dp.onEventResized = function(args) {
        totalHours -= args.e.data.hours;
        var newHours = (args.newEnd.ticks - args.newStart.ticks) / 1000 / 60 / 60;
        args.e.data.hours = newHours;
        totalHours += newHours;
        model.set("hours",totalHours);
    };

    dp.init();
}

function bindRankButtons(rank){

    var el = document.querySelector('.odometer');

    od = new Odometer({
        el: el,
        duration: 100,
        value: rank
    });

    odometerValue = rank;

    $(".qty#plus").on("click", function() {

        var odometer = $(".odometer");

       // Don't allow incrementing above ten
        if (odometerValue < 10)
            ++odometerValue;
            if(odometer.hasClass("odometer-animating")){
                odometer.removeClass("odometer-animating");
            }
            odometer.html(odometerValue);

        odometer = null;
    });

    $(".qty#minus").on("click", function() {

        var odometer = $(".odometer");

       // Don't allow decrementing below zero
        if (odometerValue > 0) {
            --odometerValue;
            if(odometer.hasClass("odometer-animating")){
                odometer.removeClass("odometer-animating");
            }
            odometer.html(odometerValue);


        }

        odometer = null;
    });
}