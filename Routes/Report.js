const express = require('express');
const router = express.Router();

const auth = require('../util/AuthCheck')
const authO = require('../util/AdminCheck')

const Report = require('../models/Reports');
const Blog = require("../models/Blogs");

//get all reports
router.get('/view', auth, authO, (req, res, next) => {
    Report.find((err, reports) => {
        if (err) {
            console.log('err' + err);
            res.render('error', {message: 'There was an internal server error',  user: req.user})
        } else {
            res.render('reports', {reports: reports,  user: req.user})
        }
    }).limit(100);
})

//get a certain report
router.get('/view/:id', auth, authO, (req, res, next) => {
    var id = req.params.id;

    Report.findOne({'_id': id}, 'reportDescription _id blogID reportedBy', (err, oneReport) => {
        if (err) {
            res.render('error', {message: 'There was an internal server error',  user: req.user})
        }
        else if (oneReport === null) {
            res.render('error', {message: `404 not found ${JSON.stringify(oneReport)}`, user: req.user})
        }
        else {
            res.render('ReportDetails', {report: oneReport, user: req.user});
        }
    })
})

router.get('/add/:blogId', auth, (req, res, next) => {
    var id = req.params.blogId;

    Blog.findOne({'_id': id}, 'heading body username', (err, oneBlog) => {
        if(err) {
            res.render('error', {message: 'There was an internal server error', user: req.user})
        }
        else if (oneBlog === null) {
            res.render('error', {message: '404 not found', user: req.user})
        }
        else {
            oneBlog.username = oneBlog.username.split('@')[0]
            res.render('addReport', {blog: oneBlog, user: req.user})
        }
    })
})

//add a new report linked to a certain blog
router.post('/add/:blogId', auth, (req, res, next) => {
    var id = req.params.blogId;

    Blog.findOne({'_id': id}, 'heading', (err, oneBlog) => {
        if(err) {
            res.render('error', {message: 'There was an internal server error', user: req.user})
        }
        else if (oneBlog === null) {
            res.render('error', {message: '404 not found', user: req.user})
        }
        else {
            Report.create({
                blogID: id,
                reportDescription: req.body.description,
                reportedBy: req.user.username
            }, (err, newReport) => {
                if (err) {
                    res.render('error', {message: 'There was an internal server error', user: req.user})
                }
                else{
                    console.log(newReport)
                    res.render('Thanks', {message: 'thanks for reporting, we will have a look at it if' +
                            'we find that this violates our community guidelines we will take action. And dont worry about ' +
                            'retaliation your report is anonymous', user: req.user})
                }
            })
        }
    })
})

//delete a report
router.get('/delete/:reportID', auth, authO, (req, res, next) => {
    const id = req.params.reportID;

    Report.findOne({'_id': id}, (err, oneReport) => {
        if (err) {
            console.log(err);
            res.render('error', {message: 'There was an internal server error', user: req.user})
        } else if (oneReport === null) {
            res.render('error', {message: '404 not found', user: req.user})
        }
        else {
            Report.deleteOne({'_id': id}, (err) => {
                if(err) {
                    console.log(err)
                    res.render('error',  {message: 'There was an internal server error', user: req.user})
                }
                else {
                    res.redirect('/reports/view')
                }
            })
        }
    })
})

//!!Editing not supported for reports like a lot of websites to preserve the integrity of community guidelines

module.exports = router;