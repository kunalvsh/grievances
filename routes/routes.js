var request = require('request');

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
		res.render('home');
	});

    app.get('/submit_home', function(req, res) {
        if (typeof(req.query.causes) == 'string') {
            req.query.causes = [req.query.causes];
        }
        var zipcode = req.query.zipcode;
        request(`https://congress.api.sunlightfoundation.com/legislators/locate?zip=${zipcode}`, function (error,
                                                                                                           response,
                                                                                                           body) {
          if (error) {
            console.log('error:', error); // Print the error if one occurred
            res.redirect('/');
            // add error message here later
          }
          var legislatorsData = JSON.parse(body);
          res.render('next', {
            zipcode: zipcode,
            causes: req.query.causes,
            legislators: legislatorsData
          });
        });
    });
}