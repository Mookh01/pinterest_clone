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
    // console.log(req.user);
    // console.log(req.user.id);
    var userId = req.user.id;
    var currentUser = req.user.username;
    mybooks.find({}, function(err, library) {
        //!!Perhaps within here we add the user.find this way to present our personal information. 

        user.findOne({ "_id": req.user.id }, function(err, data) {
            if (err) throw err;
            // console.log("DATA: ", data.myrequest);
            // console.log("DATA: ", data[0].mybooks[0].author);

            if (err) throw err;
            res.render('index', {
                library: library,
                image: library.img,
                title: library.title,
                author: library.author,
                userN: [{ person: currentUser }],
                userid: [{ id: userId }],
                myrequest: data.myrequest
            });
        });

    })
});
//Tribute will be Specific user data. 
//!!! Will need to change the data[0] in a way which we can get specific user. 
app.get('/tributes', function(req, res) {
    // console.log(req.user.id);

    user.findOne({ "_id": req.user.id }, function(err, data) {
        if (err) throw err;
        // console.log("DATA: ", data);
        // console.log("DATA: ", data[0].mybooks[0].author);
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