const express = require('express')
const router = express.Router();
const fire = require('../events/fire');
const path=require('path')


// Route Handlers

router.get('^/$|index(.html)?', (req, res) => {
    fire.emit('connection',req)
    console.log('/')
    res.sendFile(path.join(__dirname, '..','views', 'index.html'));
})
router.get('^/$|home(.html)?', (req, res) => {
    fire.emit('connection',req)
    res.sendFile(path.join(__dirname, '..','views', 'Tools.html'));
    console.log('/home')
})

router.get('/new-page(.html)?', (req, res) => {
    fire.emit('connection', req)
    console.log('/newPage')
    res.sendFile(path.join(__dirname, '..','views', 'new-page.html'))
});
router.get('/myEjs(.html)?', (req, res) => {
    fire.emit('connection', req)
    console.log('/myEjs')
    res.render(path.join(__dirname, '..','views', 'Home.ejs'))
});
router.get('/old-page(.html)?', (req, res) => {
    fire.emit('connection', req)
    console.log('/newPage')
    res.redirect(301,path.join(__dirname,'..','views','new-page.html'))
});
router.get('/tools(.html)?', (req, res,next) => {
    res.status(200).send('<h1>Tools</h1>');
    next()
}, (req, res) => {
    res.send('New Content')
});

module.exports=router