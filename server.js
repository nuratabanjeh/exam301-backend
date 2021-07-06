'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,

});

//mongoose
// mongoose.connect('mongodb://localhost:27017/pocki', { useNewUrlParser: true, useUnifiedTopology: true });
//schema
const CocktailSchema = new mongoose.Schema({
    strDrink: String,
    strDrinkThumb: String,
});

//model
const CocktailModel = mongoose.model('cocktails', CocktailSchema);

//routs
app.get('/all', allDataHandler);
app.post('/addToFav', addToFavHandler);
app.get(`/getFav`, getFavDataHandler);
app.delete(`/deleteFav`, deleteFavHandler)
app.put(`/updateFav`, updateFavHandler);
//handler
async function allDataHandler(req, res) {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;
    let data = await axios.get(url)
    console.log("🚀 ~ file: server.js ~ line 41 ~ allDataHandler ~ data", data)


    res.send(data.data.drinks)

}
function addToFavHandler(req, res) {
    console.log("🚀 ~ file: server.js ~ line 25 ~ addToFavHandler ~ req", req.body);
    const { strDrink, strDrinkThumb } = req.body;
    console.log("🚀 ~ file: server.js ~ line 50 ~ addToFavHandler ~ strDrink", strDrink)

    const item = new CocktailModel({
        strDrink: strDrink,
        strDrinkThumb: strDrinkThumb,
    })
    console.log("🚀 ~ file: server.js ~ line 59 ~ addToFavHandler ~ item", item)
    item.save();
}
function getFavDataHandler(req, res) {
    CocktailModel.find({}, (err, data) => {
        res.send(data);
    })

}
function deleteFavHandler(req, res) {
    const id = req.query.idDrink;
    console.log("🚀 ~ file: server.js ~ line 63 ~ deleteFavHandler ~ id", id)
    CocktailModel.deleteOne({ idDrink: id }, (err, data) => {
        CocktailModel.find({}, (err, data) => {
            res.send(data);
        })
    })
}
function updateFavHandler(req, res) {
    // console.log(req.body);
    const { strDrink, strDrinkThumb, idDrink } = req.body;
    console.log("🚀 ~ file: server.js ~ line 77 ~ updateFavHandler ~ req.body", req.body)
    CocktailModel.find({ _id: idDrink }, (err, data) => {

        console.log("🚀 ~ file: server.js ~ line 79 ~ CocktailModel.find ~ data", data)
        data[0].strDrink = strDrink;
        data[0].strDrinkThumb = strDrinkThumb;
        data[0].save()
            .then(() => {
                CocktailModel.find({}, (err, data) => {
                    res.send(data);
                })

            })
    })
}
app.listen(PORT, () => console.log(`hello ${PORT}`));