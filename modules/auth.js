const express = require('express');
const crypto = require('crypto');
const db = require('../db/mysql');

const router = express.Router();

router.get('/login', function (req, res) {
    res.render('login', {
        error: !!req.query.error,
    });
});

router.get('/registration', function (req, res) {
    res.render('registration', {
        error: !!req.query.error,
    });
});


router.post('/login', function (req, res) {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            throw new Error('Params are empty');
        }
        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        db.query(
            'SELECT id, username, password FROM users WHERE username = ? LIMIT 1',
            username,
            (err, results) => {
                if(err) console.error(err);
                 const password_db = results[0].password;
                 if (passwordHash === password_db) {
                    res.redirect('/');
                 }
                  else{
                     res.redirect('/login');
                    console.error(err);
                  }
            }

        );
    } catch (err) {
        res.redirect('./login?error=1');
    }
});

router.post('/registration', function (req, res) {
    const { username, password1, password2 } = req.body;
    try {
        if (!username || !password1 || !password2 || !(password1 === password2)) {
            throw new Error("Params are empty or passwords don't match");
        }

        const passwordHash1 = crypto
            .createHash('sha256')
            .update(password1)
            .digest('hex');

        db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, passwordHash1],
            (err, results) => {
                if (err) console.error(err);
                res.redirect('/login');
            }
        );

    } catch (err) {
        res.redirect('./registration?error=1');
    }
});

module.exports = router;

