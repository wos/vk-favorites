const express = require("express");
const session = require("express-session");
const passport = require("passport");
const VKontakteStrategy = require("passport-vk-strategy").Strategy;

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = new express();
const MemcachedStore = require("connect-memcached")(session);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: "CatOnKeyboard",
        key: "test",
        proxy: "true",
        resave: false,
        saveUninitialized: false,
        store: new MemcachedStore({
            hosts: ["127.0.0.1:11211"],
            secret: "123, easy as ABC. ABC, easy as 123" // Optionally use transparent encryption for memcache session data
        })
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new VKontakteStrategy(
        {
            clientID: 6969619, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
            clientSecret: "evTvfmfUqSuxfErL05Gi",
            callbackURL: "http://localhost:3000/auth/vkontakte/callback"
        },
        function myVerifyCallbackFn(
            accessToken,
            refreshToken,
            params,
            profile,
            done
        ) {
            done(null, profile);


            console.log(accessToken, refreshToken, params, profile)

            // Here goes code which will be put your user into some db

            // Now that we have user's `profile` as seen by VK, we can
            // use it to find corresponding database records on our side.
            // Also we have user's `params` that contains email address (if set in
            // scope), token lifetime, etc.
            // Here, we have a hypothetical `User` class which does what it says.

            // User.findOrCreate({ vkontakteId: profile.id })
            //   .then(function(user) {
            //     done(null, user);
            //   })
            //   .catch(done);
        }
    )
);

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, { id });
});

app.use((request, response, next) => {
    // console.log(request.headers);
    next();
});

app.use((request, response, next) => {
    request.chance = Math.random();
    next();
});

module.exports =  app;