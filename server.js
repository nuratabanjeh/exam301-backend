'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,

})
//schema
const CocktailSchema = new mongoose.Schema({
    strDrink: String,
    strDrinkThumb: String,
});
//model
const CocktailModel = mongoose.model('cocktail', CocktailSchema);
//routs
app.get('/all', allDataHandler);
app.post('/addToFav', addToFavHandler);
app.get('/getFav', getFavDataHandler);
app.delete('/deleteFav', deleteFavHandler);
app.put('/updateFav', updateFavHandler);

//handler
async function allDataHandler(req, res) {
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
    let data = await axios.get(url);
    res.send(data.data.drinks)
    console.log("🚀 ~ file: server.js ~ line 1 ~ allDataHandler ~ url", url.results)
}
function addToFavHandler(req, res) {
    const { strDrink, strDrinkThumb } = req.body;
    const item =
        new CocktailModel({
            strDrink: strDrink,
            strDrinkThumb: strDrinkThumb,

        })
    item.save();
}


function getFavDataHandler(rq, res) {
    CocktailModel.find({}, (err, data) => {
        res.send(data);
    })
}
function deleteFavHandler(req, res) {
    const id = req.query.id;
    CocktailModel.deleteOne({ idDrink: id }, (err, data) => {
        CocktailModel.find({}, (err, data) => {
            res.send(data);
        })
    }
    )
}
function updateFavHandler(req, res) {
    const { strDrink, strDrinkThumb, idDrink } = req.body;
    CocktailModel.find({ idDrink: idDrink }, (err, data) => {
        data[0].strDrink = strDrink,
            data[0].strDrinkThumb = strDrinkThumb,
            data[0].save()
                .then(() => {
                    CocktailModel.find({}, (err, data) => {
                        res.send(data);
                    })
                })

    })
}

app.listen(PORT, () => console.log(`hiii port ${PORT}`))