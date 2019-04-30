const db = require("../models")

module.exports = function(app) {

    app.get("/", function(req, res) {

        var articleObject = {}

        articleObject["articles"] = []

        db.article.find({$query: {saved: false} }).sort( { date: -1 })
        .then(function(found) {
            if (found.length > 0) {
                for (let i = 0; i < found.length; i ++ ) {

                    // console.log(found[i]);

                    newObject = {
                        id: found[i]._id,
                        article: found[i].article,
                        summary: found[i].summary,
                        link: found[i].link,
                        photo: found[i].photo,
                        saved: found[i].saved,
                        notes: found[i].notes
                    }

                    articleObject.articles.push(newObject);

                    if (i == (found.length - 1)) {
                        // res.json(articleObject)

                        res.render("home", articleObject)
                    }
                }
            }

            else {
                res.render("home")
            }

        });

    });

    app.get("/saved", function(req, res) {
        var articleObject = {}

        articleObject["articles"] = []

        db.article.find({saved: true}).sort({date: -1})
        .then( function(found) {

            if (found.length > 0) {
                for (let i = 0; i < found.length; i ++ ) {

                    console.log(found[i]);

                    newObject = {
                        id: found[i]._id,
                        article: found[i].article,
                        summary: found[i].summary,
                        link: found[i].link,
                        photo: found[i].photo,
                        saved: found[i].saved,
                        notes: found[i].notes
                    }

                    articleObject.articles.push(newObject);

                    if (i == (found.length - 1)) {
                        // res.json(articleObject)
                        // let newArticles = articleObject.articles.reverse();
                        // articleObject["articles"] = newArticles
                        res.render("saved", articleObject)
                    }
                }
            }

            else {
                res.render("saved")
            }

        });


    });
}