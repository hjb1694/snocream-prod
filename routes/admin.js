const router = require('express').Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const jimp = require('jimp');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, (req,res) => {

    res.render('adminpanel');

});


router.get('/login', (req,res) => {

    res.render('login');

});

router.post('/login', async (req,res) => {


    const {username, password} = req.body;

    const userFilePath = path.join(__dirname, '..', 'database', 'users.json');

    const users = fs.readFileSync(userFilePath);
    const usersDecoded = JSON.parse(users);

    const userMatch = usersDecoded.find(item => item.username == username);

    if(!userMatch){

        return res.json({error : 'invalid credentials'});

    }

    const passMatched = bcrypt.compareSync(password, userMatch.password);

    if(!passMatched){

        return res.json({error : 'invalid credentials'});

    }

    req.session.isAuth = true;

    res.json({success : 'user authenticated'});

       


});


router.get('/logout', isAuth, (req,res) => {

    req.session.destroy();

    res.redirect('/');


});

router.get('/offers', isAuth, (req,res) => {

    const offersPath = path.join(__dirname, '..', 'database', 'offers.json');

    const offers = fs.readFileSync(offersPath);

    const offersParsed = JSON.parse(offers);

    res.render('offerspanel', {
        offers : offersParsed
    });


});

router.post('/offers', isAuth, (req,res) => {

    const {headline, description, expires} = req.body;

    const offersPath = path.join(__dirname, '..', 'database', 'offers.json');

    const offers = fs.readFileSync(offersPath);

    const offersParsed = JSON.parse(offers);

    const newItem = {
        id : uuid(),
        headline, 
        description, 
        expires
    }

    offersParsed.push(newItem);

    const offersString = JSON.stringify(offersParsed);

    fs.writeFileSync(offersPath, offersString);


    res.redirect('/admin/offers');


});

router.post('/offers/delete', isAuth, (req,res) => {

    const {offerId} = req.body;

    const offersPath = path.join(__dirname, '..', 'database', 'offers.json');

    const offers = fs.readFileSync(offersPath);

    const offersDecoded = JSON.parse(offers);

    const offerToDelete = offersDecoded.findIndex(offer => offer.id === offerId);

    console.log(offerToDelete);

    offersDecoded.splice(offerToDelete, 1);

    const offersEncoded = JSON.stringify(offersDecoded);

    fs.writeFileSync(offersPath, offersEncoded);

    res.redirect('/admin/offers');

});

router.get('/menu', isAuth, (req,res) => {

    res.render('menupanel');


});

router.get('/menu/snocreams', isAuth, (req,res) => {

    const snocreamsPath = path.join(__dirname, "..", "database", "snocreams.json");

    const snocreamsJSON = fs.readFileSync(snocreamsPath);

    const snocreamsDecoded = JSON.parse(snocreamsJSON);


    res.render('menupanel-snocreams', {
        snocreams : snocreamsDecoded
    });


});

router.get('/menu/snocreams/edit/:id', isAuth, (req,res) => {

    const id = req.params.id;

    const snocreamsPath = path.join(__dirname, "..", "database", "snocreams.json");

    const snocreamsJSON = fs.readFileSync(snocreamsPath);

    const snocreamsDecoded = JSON.parse(snocreamsJSON);

    const targetItem = snocreamsDecoded.find(item => item.id == id);

    if(!targetItem){
        return res.redirect('/admin/menu/snocreams');
    }

    res.render('snocream-edit', {
        item : targetItem
    });


});

router.post('/menu/snocreams/edit', isAuth, (req,res) => {

    function saveData(newFileName){

        const { name, desc, itemid } = req.body;

        const snocreamsPath = path.join(__dirname, "..", "database", "snocreams.json");

        const snocreamsJSON = fs.readFileSync(snocreamsPath);

        const snocreamsDecoded = JSON.parse(snocreamsJSON);

        const itemIndex = snocreamsDecoded.findIndex(item => item.id == itemid);

        snocreamsDecoded[itemIndex].name = name;
        snocreamsDecoded[itemIndex].description = desc;
        if(newFileName){
            snocreamsDecoded[itemIndex].image = '/img/' + newFileName;
        }

        const snocreamsEncoded = JSON.stringify(snocreamsDecoded);

        fs.writeFileSync(snocreamsPath, snocreamsEncoded);

    }

    if(req.files){

        const newFileName = Date.now() + '-' + req.files.newImage.name;

        jimp.read(req.files.newImage.data)
        .then(image => {
            image.resize(jimp.AUTO, 256)
            .write('./assets/img/' + newFileName);

            saveData(newFileName);

            res.redirect('/admin/menu/snocreams');

        });

    } else {

        saveData();

        res.redirect('/admin/menu/snocreams');

    }


});

router.post('/menu/snocreams/delete', isAuth, (req,res) => {

    const { deleteId } = req.body;

    const snocreamsPath = path.join(__dirname, "..", "database", "snocreams.json");

    const snocreamsJSON = fs.readFileSync(snocreamsPath);

    const snocreamsDecoded = JSON.parse(snocreamsJSON);

    const indexToDelete = snocreamsDecoded.findIndex(item => item.id == deleteId);

    snocreamsDecoded.splice(indexToDelete,1);

    const snocreamsEncoded = JSON.stringify(snocreamsDecoded);

    fs.writeFileSync(snocreamsPath, snocreamsEncoded);

    res.redirect('/admin/menu/snocreams');

});

router.get('/menu/snocreams/add', isAuth, (req,res) => {

    res.render('add-snocream');


});




module.exports = router;