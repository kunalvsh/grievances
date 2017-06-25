var categories = require("../data/categories.json"),
    request = require('request');

module.exports = function(app, io) {

    app.use(function(req, res, next) {
        res.status(404);
        if (req.accepts('html')) {
    		res.redirect('/');
            return;
        }
        if (req.accepts('json')) {
            res.send({
                error: 'Not found'
            });
            return;
        }
        res.type('txt').send('Not found');
    });

	app.get('/', function(req, res) {
        res.render('home', {
            categories: categories,
            message: req.flash()
        });
	});

    app.get('/submit_home', function(req, res) {
        if (typeof(req.query.causes) == 'string') {
            req.query.causes = [req.query.causes];
        }
        var causes = req.query.causes;
        var zipcode = req.query.zipcode;

        // Logic to get orgs to show from chosen causes.
        var interestedOrgs = [];
        for (var i =0; i < causes.length; i++) {
            interestedOrgs = interestedOrgs.concat(categories[causes[i]].orgs);
        }
        // Only keep unique interestedOrgs
        interestedOrgs = interestedOrgs.filter(function (x, i, a) {
            return a.indexOf(x) == i;
        });

        request('https://congress.api.sunlightfoundation.com/legislators/locate?zip=' + zipcode, function (error,
                                                                                                           response,
                                                                                                           body) {
            var bodyData = JSON.parse(body);
            if (error || bodyData.results.length == 0 || bodyData.count == 0) {
                console.log('error:', error); // Print the error if one occurred
                req.flash('error', zipcode + " is not a valid US zipcode.")
                res.redirect('/');
                // add error message here later
            }

            var legislatorsData = JSON.parse(body).results;
            var localLegislators = [];
            for (i in legislatorsData) {
                localLegislators.push(legislatorsData[i]);
              }
            var newsUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
            newsUrl += '?api-key=d02753ccca9140b08beb5104437d0245&sort=newest&q=' + causes[0];
            request(newsUrl, function (error2, response2, body2) {
                if (error) {
                    console.log('error:', error); // Print the error if one occurred
                    res.redirect('/');
                    // add error message here later
                }
                var newsData = JSON.parse(body2);
                var orgs = require("../data/orgs.json");
                res.render('next', {
                    zipcode: zipcode,
                    causes: causes,
                    localLegislators: localLegislators,
                    newsArticles: newsData.response.docs,
                    interestedOrgs: interestedOrgs,
                    orgs: orgs,
                    categories: categories
                });
            });
        });
    });
}

// chamber
// first_name
// last_name
// district
// website
// state
// twitter_id
// oc_email
// phone
// party
// title
// term_end
