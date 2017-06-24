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
        res.render('next', {
            zipcode: req.query.zipcode,
            causes: req.query.causes
        });
    });
}