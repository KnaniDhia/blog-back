const PostActualite = require('../models/post.model');
const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // Limit file size to 20MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image'); // Expect a single file upload with the field name 'image'

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const ajouterPostActualite = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        } else {
            try {
                const newPost = new PostActualite({
                    Titre: req.body.Titre,
                    Contenu: req.body.Contenu,
                    keywords: req.body.keywords ? req.body.keywords.split(',').map(kw => kw.trim()) : [],
                    image: req.file ? req.file.path : null
                });
                await newPost.save();
                return res.status(201).json({
                    ...newPost.toObject(),
                    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/public/images/${req.file.filename}` : null
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Une erreur s'est produite lors de l'ajout d'un post d'actualité"
                });
            }
        }
    });
};

const obtenirPostsActualite = async (req, res) => {
    try {
        const posts = await PostActualite.find();
        const postsWithImageUrl = posts.map(post => ({
            ...post.toObject(),
            imageUrl: post.image ? `${req.protocol}://${req.get('host')}/public/images/${path.basename(post.image)}` : null
        }));
        return res.status(200).json(postsWithImageUrl);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Une erreur s'est produite lors de la récupération des posts d'actualité"
        });
    }
};

const obtenirPostParId = async (req, res) => {
    try {
        const post = await PostActualite.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: "Post non trouvé"
            });
        }
        const postWithImageUrl = {
            ...post.toObject(),
            imageUrl: post.image ? `${req.protocol}://${req.get('host')}/public/images/${path.basename(post.image)}` : null
        };
        return res.status(200).json(postWithImageUrl);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Une erreur s'est produite lors de la récupération du post"
        });
    }
};

const mettreAJourPostActualite = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        } else {
            try {
                const updatedData = {
                    Titre: req.body.Titre,
                    Contenu: req.body.Contenu,
                    keywords: req.body.keywords ? req.body.keywords.split(',').map(kw => kw.trim()) : []
                };
                if (req.file) {
                    updatedData.image = req.file.path;
                }
                const post = await PostActualite.findByIdAndUpdate(req.params.id, updatedData, { new: true });
                if (!post) {
                    return res.status(404).json({
                        message: "Post non trouvé"
                    });
                }
                const postWithImageUrl = {
                    ...post.toObject(),
                    imageUrl: post.image ? `${req.protocol}://${req.get('host')}/public/images/${path.basename(post.image)}` : null
                };
                return res.status(200).json(postWithImageUrl);
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Une erreur s'est produite lors de la mise à jour du post"
                });
            }
        }
    });
};

const supprimerPostActualite = async (req, res) => {
    try {
        const post = await PostActualite.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: "Post non trouvé"
            });
        }
        return res.status(200).json({
            message: "Post supprimé avec succès"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Une erreur s'est produite lors de la suppression du post"
        });
    }
};

const rechercherPostsParKeywords = async (req, res) => {
    try {
        const keywords = req.query.keywords.split(',').map(kw => kw.trim());
        const posts = await PostActualite.find({ keywords: { $in: keywords } });
        const postsWithImageUrl = posts.map(post => ({
            ...post.toObject(),
            imageUrl: post.image ? `${req.protocol}://${req.get('host')}/public/images/${path.basename(post.image)}` : null
        }));
        return res.status(200).json(postsWithImageUrl);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Une erreur s'est produite lors de la recherche des posts"
        });
    }
};

module.exports = {
    ajouterPostActualite,
    obtenirPostsActualite,
    obtenirPostParId,
    mettreAJourPostActualite,
    supprimerPostActualite,
    rechercherPostsParKeywords
};