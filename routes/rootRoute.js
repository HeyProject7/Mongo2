const express = require('express')
const router = express.Router();
const fire = require('../events/fire');
const path = require('path');
const SignUp = require('../controller/sign_up');
const login = require('../controller/studygears_login');
const Courses = require("../model/Courses");

// Route Handlers
router.get('^/$|index(.html)?', (req, res) => {
    fire.emit('connection', req)
    console.log('/  Get ')
    res.status(200).sendFile(path.join(__dirname, '..', 'views', 'rootViews', 'index.html'));
})
router.post('^/$|index(.html)?', (req, res) => {
    fire.emit('connection', req)
    console.log('/  Post ')
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})
router.get('^/$|courses(.html)?', (req, res) => {
    Courses.find({}, (err, data) => {
        if (err) return console.log(err);
        console.log("ARRAY ", data);
        res.render(path.join(__dirname, '..', 'views', 'rootViews', 'courses.pug'), {
            courses: data
        });
    });

    // res.sendFile(path.join(__dirname, '..', 'views', 'rootViews', 'courses.html'));
})

router.get('/about(.html)?', (req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, '..', 'views', 'rootViews', 'about.html'))
});
router.get('/contact(.html)?', (req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, '..', 'views', 'rootViews', 'contact.html'))
});
router.get('/login_signIn(.html)?', (req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, '..', 'views', 'rootViews', 'login_signIn.html'))
});
router.get('/register(.html)?', (req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, '..', 'views', 'rootViews', 'register.html'))
});
router.get('/old-page(.html)?', (req, res) => {
    fire.emit('connection', req)
        // res.redirect(path.join(__dirname, '..', 'views', 'new-page.html'))
    res.redirect('/new-page');
    console.log(req.url)

});
router.get('/tools(.html)?', (req, res, next) => {
    res.status(200).send('<h1>Tools</h1>');
    next()
}, (req, res) => {
    res.send('New Content')
});

// Handling SignUp
router.post('/sign-up(.html)?', SignUp.createNewUser);

// Handling Login
router.post('/login_signIn(.html)?', login.check_user);

module.exports = router;