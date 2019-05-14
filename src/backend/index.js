const passport = require("passport");

const app = require("./bootstrap.js");
const makeDir = require("./fileWorker.js");
const path = require("path");

app.get("/auth/vkontakte", passport.authenticate("vkontakte"));

app.get(
    "/auth/vkontakte/callback",
    passport.authenticate("vkontakte", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/auth", function(request, response) {
    if (!request.user) {
        response.redirect("/auth/vkontakte");
    } else {
        response.json(request.user);
        makeDir(request.user.id);
    }
});

app.get("/counter", function(request, response) {
    if (request.session.views) {
        ++request.session.views;
    } else {
        request.session.views = 1;
    }
    response.json({
        counter: request.session.views,
    });
});

app.listen(3001);
