if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const app = express();
const db = require('./database/db');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const user = require('./models/user.js');
const ReviewRoutes =require('./routes/reviewroutes.js');
const CampgroundRoutes = require('./routes/campgroundroutes.js');
const userRoutes =require('./routes/userroutes.js');
const session =require('express-session');
const flash = require('connect-flash')
const passport =require('passport');
const LocalStrategy =require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

//To sanitize html
app.use(mongoSanitize());
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to the database
db();
const dbUrl = 'mongodb+srv://Harinathreddy:Test123@cluster0.t0aevfa.mongodb.net/Campground_Database?retryWrites=true&w=majority&appName=Cluster0';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error",function(e){
    console.log("Session Store error",e)
})

const SessionConfig = { 
    store,
    secret:'Thisisnotbettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(SessionConfig))
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/",
    "https://cdn.maptiler.com/",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com/",
    "https://cdn.maptiler.com/",
];

const fontSrcUrls = [
    "'self'",
    "https://cdn.jsdelivr.net",
];

const connectSrcUrls = [
    "https://api.maptiler.com/",
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            fontSrc: ["'self'", ...fontSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/", 
                "https://images.unsplash.com/",
            ],
        },
    })
);



app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error =req.flash('error');
    res.locals.currentUser = req.user;
    next();
})


//Routes
app.use('/',userRoutes);
app.use('/campground', CampgroundRoutes);
app.use('/campgrounds', ReviewRoutes);

app.get('/',(req,res)=>{
    res.render('campgrounds/homepage')
})

app.all('*', function (req, res, next) {
    res.render('campgrounds/error page')
});


// Add a route for favicon.ico to prevent errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(3000, () => {
    console.log("Serving on port 3000");
});
