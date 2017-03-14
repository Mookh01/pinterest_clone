var expressValidator = require('express-validator');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var books = require('google-books-search');
var mybooks = require('./models/book.js');
var user = require('./models/user.js');
var routes = require('./routes/index.js');
var bodyParser = require('body-parser');
var Localstrategy = require('passport-local').Strategy;
var passport = require("passport");
var app = express();
var flash = require("connect-flash");
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookgroup');

//CONNECT FLASH
var flash = require('connect-flash');

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views/pages');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 4400);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
var router = express.Router();
app.use(cookieParser());

//EXPRESS SESSIONS
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());

//EXPRESS VALIDATOR
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(flash());

//GLOBAL VARIABLES
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});



//Loads database of books to main page. 
app.get('/', ensureAuthenticated, function(req, res) {
    var bkauth = req.body.author;
    var bktitle = req.body.title;
    var userId = req.user.id;
    var currentUser = req.user.username;
    mybooks.find({}, function(err, library) {
        user.findOne({ "_id": req.user.id }, function(err, data) {
            if (err) throw err;
            res.render('index', {
                library: library,
                image: library.img,
                title: library.title,
                author: library.author,
                userN: [{ person: currentUser }],
                userid: [{ id: userId }],
                myrequest: data.myrequest,
                requestfrom: data.requestFrom,
                popauth: bkauth,
                poptitle: bktitle
            });
        });

    })
});

app.get('/settings', ensureAuthenticated, function(req, res) {
    var userID = req.user._id;
    user.findById(userID, function(err, usr) {
        if (err) throw err;
        res.render('settings', {
            user: usr
        });
    });

});
app.post('/settings', function(req, res) {
    var cty = req.body.city;
    var stt = req.body.state;
    var userID = req.user._id;
    if (cty !== "" && stt !== "") {
        var location = { city: cty, state: stt };
    } else if (cty !== "" && stt === "") {
        var location = { city: cty };
    } else if (cty === "" && stt !== "") {
        var location = { state: stt };
    }

    user.findByIdAndUpdate(userID, location, function(err, info) {
        if (err) throw err;
        var city = req.body.city;
        var state = req.body.state;
    });
    res.redirect("/settings");
});

//User Books Page
app.get('/tributes', function(req, res) {
    user.findOne({ "_id": req.user.id }, function(err, data) {
        if (err) throw err;
        res.render('tributes', {
            library: data.mybooks,
        });
    })
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}

var authRouter = require("./auth");
app.use('/auth', authRouter);


var pagesRouter = require("./pages");
app.use('/pages', pagesRouter);


var server = require('http').createServer(app);
server.listen(app.get('port'), function() {
    console.log('Express is running on port ' + app.get('port'));
});

require('./routes')(server);