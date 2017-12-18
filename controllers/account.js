const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('account/settings', {
        user: req.user
    })
});

module.exports = router;