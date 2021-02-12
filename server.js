const express = require('express');
const mongoose = require('mongoose');
const Schema = require('./models/shortUrl');
const app = express();
mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : false }));

app.get('/', async (req, res) => {
	
    const all_urls = await Schema.find();
    res.render('index', { URL: all_urls});
})

app.post('/shortUrls', async (req ,res) => {
    await Schema.create({full : req.body.fullUrl});
    res.redirect('/');	
})

app.get('/:shortUrl', async (req, res) => {
    const generated_url = await Schema.findOne({ short: req.params.shortUrl});
    
    if (generated_url == null) {
        res.sendStatus(404);
    }
    
    generated_url.clicks++;
    generated_url.save();

    res.redirect(generated_url.full);
})


app.listen(process.env.PORT || 5000);
