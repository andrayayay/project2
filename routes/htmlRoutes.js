var db = require("../models");
// var express = require("express");
// var app = express();
const geocode = require("../src/utils/geocode");
const events = require("../src/utils/events");
const moment = require("moment");
module.exports = function(app) {
  // Load index page
  app.get("/favorites", function(req, res) {
    db.Favorites.findAll({}).then(function() {
      res.render("favorites", {
        title: "Favorites",
        msg: "These are your favorite events!"
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Favorites.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  app.post("/api/create", (req, res) => {
    res.render(req.body[1]);
  });

  app.get("/", (req, res) => {
    res.render("index", {
      title: "What the Fun?!"
    });
  });

  app.get("/friends", (req, res) => {
    res.render("friends", {
      title: "Friends"
    });
  });

  app.get("/events", (req, res) => {
    geocode.geocode(req.query.address, (error, { latitude, longitude }) => {
      if (error) return res.send({ error });
      else {
        events(
          latitude,
          longitude,
          moment(new Date(req.query.date)).format("YYYY-MM-DD"),
          req.query.tzOffset,
          req.query.q,
          req.query.category,
          req.query.offset,
          req.query.range,
          (error, data) => {
            if (error) return res.send({ error });
            else if (data[0].title === "No results found!") {
              res.send(data);
            } else {
              data.forEach(el => {
                el.start_time = moment(el.start, moment.ISO_8601)
                  .tz(el.timezone)
                  .format("h:mm a z");
                el.date = moment(el.start)
                  .tz(el.timezone)
                  .format("LL");
              });
              res.send(data);
            }
          }
        );
      }
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
