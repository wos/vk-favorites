const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

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
            secret: "123, easy as ABC. ABC, easy as 123", // Optionally use transparent encryption for memcache session data
        }),
    })
);

// app.use("/", express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, 'build')));


app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new VKontakteStrategy(
        {
            clientID: 6969619, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
            clientSecret: "evTvfmfUqSuxfErL05Gi",
            callbackURL: "http://localhost:3000/auth/vkontakte/callback",
        },
        function myVerifyCallbackFn(
            accessToken,
            refreshToken,
            params,
            profile,
            done
        ) {
            done(null, profile);

            console.log(accessToken, refreshToken, params, profile);
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

module.exports = app;
