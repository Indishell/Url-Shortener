const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : true }));

app.get('/', async (req, res) => {
    
    const all_urls = await ShortUrl.find();
    res.render('index', { URL: all_urls});
})

app.post('/shortUrls', async (req ,res) => {

    await ShortUrl.create({full : req.body.fullUrl});
    res.redirect('/');
})


app.get('/:shortUrl', async (req, res) => {

    const generated_url = await ShortUrl.findOne({ short: req.params.shortUrl});

    if (generated_url == null) {
        res.sendStatus(404);
    }

    generated_url.clicks++;
    generated_url.save();

    res.redirect(generated_url.full);
})


app.listen(process.env.PORT || 5000);
