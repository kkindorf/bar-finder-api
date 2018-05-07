const Authentication = require('./controllers/authentication');
const BarController = require('./controllers/barController');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false });

module.exports = function(app) {
    app.get('/', requireAuth, function(req,res) {
        res.send({ hi: 'there' });
    })
    app.post('/signin',requireSignIn, Authentication.signin);
    app.post('/signup', Authentication.signup);
    app.get('/search/:query', BarController.barQuery);
    app.post('/handle-user',  requireAuth, BarController.handleUser);
    app.get('/grab-review/:barAlias', BarController.grabReview);
}