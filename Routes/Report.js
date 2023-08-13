const express = require('express');
const router = express.Router();

const Report = require('../models/Reports');
const Blog = require("../models/Blogs");

//get all reports
router.get('/view', (req, res, next) => {
    const headers = JSON.stringify(req.rawHeaders)

    if(headers.includes('_auth=ey')) {
        Report.find((err, reports) => {
            if (err) {
                console.log('err' + err);
            } else {
                res.json(reports)
            }
        }).limit(100);
    }
    else {
        res.sendStatus(401);
    }
})

//get a certain report
router.get('/view/:id', (req, res, next) => {
    var id = req.params.id;
    const headers = JSON.stringify(req.rawHeaders)

    if(headers.includes('_auth=ey')) {
        Report.findOne({'_id': id}, 'reportDescription _id blogID reportedBy', (err, oneReport) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            else if (oneReport === null) {
                res.sendStatus(404)
            }
            else {
                res.json(oneReport);
            }
        })
    }
    else {
        res.sendStatus(401)
    }
})

//add a new report linked to a certain blog
router.post('/add/:blogId', (req, res, next) => {
    var id = req.params.blogId;

    Blog.findOne({'_id': id}, 'heading body date', (err, oneBlog) => {
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }
        else if (oneBlog === null) {
            res.sendStatus(404)
        }
        else {
            Report.create({
                blogID: id,
                reportDescription: req.body.description,
                reportedBy: 'generic user'
            }, (err, newReport) => {
                if (err) {
                    console.log(err)
                }
                else{
                    res.sendStatus(200)
                }
            })
        }
    })
})

//delete a report
router.post('/delete/:reportID', (req, res, next) => {
    const headers = JSON.stringify(req.rawHeaders)
    const id = req.params.reportID;

    if(headers.includes('_auth=ey')) {
        Report.findOne({'_id': id}, (err, oneReport) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else if (oneReport === null) {
                res.sendStatus(404)
            }
            else {
                Report.deleteOne({'_id': id}, (err) => {
                    if(err) {
                        console.log(err)
                        res.sendStatus(500)
                    }
                    else {
                        res.sendStatus(200)
                    }
                })
            }
        })
    }
    else {
        res.sendStatus(401);
    }
})

//edit handler for reports
router.post('/edit/:id', (req, res, next) => {
    var id = req.params.id;

    Report.updateOne(
        {"_id" : id},
        {
            reportDescription: req.body.description,
        },
        (err, updatedReport) => {
            if(err) {
                console.log(err)
            }
            else {
                res.sendStatus(200)
            }
        }
    )
})

module.exports = router;