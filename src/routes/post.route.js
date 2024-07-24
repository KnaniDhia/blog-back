const express = require('express');
const router = express.Router();

const { 
    ajouterPostActualite,
    obtenirPostsActualite,
    obtenirPostParId,
    mettreAJourPostActualite,
    supprimerPostActualite,
    rechercherPostsParKeywords
 } = require('../controllers/post.controller');
const { getGoogleNews, } = require('../controllers/news.controller');

router.post('/ajout', ajouterPostActualite)

router.get('/getAll', obtenirPostsActualite);

router.get('/get/:id', obtenirPostParId);

router.get('/search', rechercherPostsParKeywords);

router.put('/update/:id', mettreAJourPostActualite);

router.delete('/delete/:id', supprimerPostActualite);


router.get('/news', getGoogleNews);

module.exports = router 