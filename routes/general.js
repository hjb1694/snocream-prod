const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req,res) => {

    res.render('index');

});

router.get('/menu', (req,res) => {

    const snocreamsPath = path.join(__dirname, "..", "database", "snocreams.json");

    const snocreamsJSON = fs.readFileSync(snocreamsPath);

    const snocreamsDecoded = JSON.parse(snocreamsJSON);


    res.render('menu', {
        snocreams : snocreamsDecoded
    });

});

router.get('/offers', (req,res) => {

    const offersPath = path.join(__dirname, '..', 'database', 'offers.json');

    const offersJSON = fs.readFileSync(offersPath);

    const offersObj = JSON.parse(offersJSON);

    res.render('offers', {
        offers : offersObj
    });

});



module.exports = router;