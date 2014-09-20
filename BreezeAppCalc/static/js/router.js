/**
 * Created by Nir on 9/8/2014.
 */

App.CalcSalaryComponent = Ember.Component.extend({
    actions: {
        next: function() {
            this.sendAction('next');
        }
    },

    isvisible: false,

    // Observed CSS properties
    cssProperties: ['display'],

    // animation properties
    duration: 700,
    easing: "easeInOutCubic",

    didInsertElement: function() {
        this.set("display",'block');
        this.$("#movie-name-wrapper").slideDown();
    },

    afterAnimate: function() {
        this.set("isVisible", true);
    }
});

App.CalcTimelineComponent = Ember.Component.extend({
    actions: {
        next: function() {
            this.sendAction("next",parseInt($(".odometer-value").text()));
        },
        back: function() {
            this.sendAction("back",parseInt($(".odometer-value").text()));
        }
    },

    isvisible: false,

    // Observed CSS properties
    cssProperties: ['display'],

    // animation properties
    duration: 700,
    easing: "easeInOutCubic",

    didInsertElement: function() {
        this.set("display",'block');
        this.$("#movie-rank-wrapper").slideDown();
    },

    afterAnimate: function() {
        this.set("isVisible", true);
    }
});

App.CalcTableComponent = Ember.Component.extend({
    actions: {
        finish: function() {
            this.sendAction('next');
        },
        back: function() {
            this.sendAction("back");
        }
    }
});

App.IndexRoute = Ember.Route.extend({
    model: function () {
        return App.AddMovieState.create({
            isNameViewed: true,
            isRankViewed: false,
            salary: null,
            hours: 0
        });
    },

    renderTemplate: function(){
        this.render('add-movie', {   // the template to render
          outlet: 'newMovieAction'              // the name of the outlet in that template
        });

        Ember.run.schedule('afterRender', function () {
            bindTextUpdate();
        });
    }
});

App.IndexController = Ember.Controller.extend({
    actions: {
        saveSalary: function () {
            var model = this.get("model")
                                .set("isNameViewed", false)
                                .set("isRankViewed", true)
                                .set("hours",0);

            Ember.run.schedule('afterRender', function () {
                initDailyPilot(model);
            });
        },
        saveTimeline: function (rank) {
            this.get("model")
                    .set("isRankViewed", false);
        },
        saveSummary: function () {

            // open Pop-up
            $('#results-modal').modal();
        },
        goToName: function (rank) {
            this.get("model")
                    .set("movieRecord.rank",rank)
                    .set("isNameViewed", true);
        },

        goToRank: function () {
            var model = this.get("model")
                                .set("isRankViewed", true);

            Ember.run.schedule('afterRender', function () {
                bindRankButtons(model.get("movieRecord.rank"));
                model = null;
            });
        }
    }
});

App.Router.map(function(){
    this.route('ranking');
    this.route('addmovie');
    this.route('summary');
    this.resource('movies');
});