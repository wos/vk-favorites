const app = require("./bootstrap.js");
const passport = require("passport");

app.get("/auth/vkontakte", passport.authenticate("vkontakte"));

app.get(
  "/auth/vkontakte/callback",
  passport.authenticate("vkontakte", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.get("/", function(request, response) {
  if (!request.user) {
    response.redirect("/auth/vkontakte");
  } else {
    response.json(request.user);
  }
});

app.get("/counter", function(request, response) {
  if (request.session.views) {
    ++request.session.views;
  } else {
    request.session.views = 1;
  }
  response.json({
    counter: request.session.views
  });
});

app.listen(3000);
