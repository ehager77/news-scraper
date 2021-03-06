const cheerio = require("cheerio");
const request = require("request");
const db = require("../models")

module.exports = function(app) {

    app.get("/api/all", function(req, res) {

        db.article.find({$query: {saved: false} }).sort( { date: -1 })
        .then( function(response) {
            res.json(response.length)
            // res.json(response)
        })

    });

    app.get("/api/notes/all", function(req, res) {

        db.note.find({})
        .then( function(response) {
            res.json(response)
            // res.json(response)
        })
    });

    // post
    app.post("/api/scrape", function(req, res) {

        request("http://www.npr.org/sections/news/", function(error, response, html) {

            const $ = cheerio.load(html);

            console.log($("article.item").length)

            $("article.item").each(function(i, element) {


                let article = $(element).find('.item-info').find('.title').find('a').text();
                let summary = $(element).find('.item-info').find('.teaser').find('a').text();
                let link = $(element).find('.item-info').find('.title').children().attr("href");
                let photo = $(element).find('.item-image').find('.imagewrap').find('a').find('img').attr("src");
                let date = $(element).find('.item-info').find('.teaser').find('a').find('time').attr("datetime");

                let articleObject = {
                    article: article,
                    summary: summary, 
                    link: link,
                    photo: photo,
                    date: date
                }

                db.article.create(articleObject, function(error) {
                    if (error) console.log("Article already exists: " + articleObject.article)
                    else {
                        console.log("New article: " + articleObject.article);
                    }

                    if (i == ($("article.item").length - 1)) {
                        res.json("scrape complete")
                    }
                })

            });

        })
    });

    // delete
    app.delete("/api/reduce", function(req, res) {

        db.article.find({$query: {saved: false} }).sort( { date: -1 })
        .then( function(found) {

            console.log(found.length);
            let countLength = found.length;
            let overflow = countLength - 25;
            console.log(overflow)
            let overflowArray = [];

            for (var i = 0; i < (overflow); i ++) {
                overflowArray.push(found[25+i]._id);
                console.log(overflowArray)
            }

            db.article.remove({_id: {$in: overflowArray}}, function(error, result) {

                result["length"] = countLength;
                console.log(result)
                res.json(result)

            })

        });

    })

    app.put("/api/save/article/:id", function(req, res) {
        let articleId = req.params.id;

        db.article.findOneAndUpdate(
            {_id: articleId},
            {
                $set: {saved: true}
            }
        ).then(function(result) {
            res.json(result)
        })
    });


    app.put("/api/delete/article/:id", function(req, res) {
        let articleId = req.params.id;

        db.article.findOneAndUpdate(
            {_id: articleId},
            {
                $set: {saved: false}
            }
        ).then(function(result) {
            res.json(result)
        })
    });

    app.get("/api/notes/:id", function(req, res) {
        let articleId = req.params.id;

        db.article.findOne(
            {_id: articleId}
        )
        .populate("note")
        .then(function(result) {
            res.json(result)
        })
    });

    app.post("/api/create/notes/:id", function(req, res) {
        console.log(req.body);

        db.note.create(req.body)
        .then(function(dbnote) {
            return db.article.findOneAndUpdate({ _id: req.params.id }, { note: dbnote._id }, { new: true });
        })
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.json(err);
        });

    });

    // delete article documents manually if needed
    app.get("/api/clear", function(req, res) {

        db.article.remove()
        .then(function() {
            res.json("documents removed from article collection")
        })

    });

    // delete note
    app.delete("/api/delete/notes/:id", function(req, res) {

        db.note.remove(
            {_id: req.params.id}
        )
        .then(function(result) {
            res.json(result)
        })

    });


}