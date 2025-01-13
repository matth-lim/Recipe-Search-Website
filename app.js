// http://localhost:3000

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

require('dotenv').config();

const app_id = process.env.EDAMAM_APP_ID;
const app_key = process.env.EDAMAM_APP_KEY;

let foodTitle = "";
let foodRecipe = [];
let foodCalories = "";
let foodImgUrl = "";

let addFoodTitle = [];
let addFoodRecipe = [];
let addFoodCalories = [];
let addFoodImgUrl = [];


app.get("/", function(req, res) {
    res.render("home");
});

app.get("/recipe", function(req, res) {
    res.render("recipe", {foodTitle: foodTitle, 
        foodRecipe: foodRecipe, 
        foodCalories: foodCalories, 
        foodImgUrl: foodImgUrl,
        addFoodTitle: addFoodTitle,
        addFoodRecipe: addFoodRecipe,
        addFoodCalories: addFoodCalories,
        addFoodImgUrl: addFoodImgUrl
    });
});

app.get("/error", function(req, res) {
    res.render("error", {foodTitle: foodTitle});
});

app.post("/", function(req, res) {
    const foodName = req.body.foodName;
    foodRecipe = [];
    addFoodTitle = [];
    addFoodRecipe = [];
    addFoodCalories = [];
    addFoodImgUrl = [];
    request("https://api.edamam.com/api/recipes/v2?type=public&q=" + foodName + "&app_id=" + app_id + "&app_key=" + app_key, function(error, response, body) {
        if (!error && response.statusCode === 200 && (JSON.parse(body).hits).length !== 0) {
            const data = JSON.parse(body);
            foodTitle = data.hits[0].recipe.label;
            for (let i = 0; i < data.hits[0].recipe.ingredientLines.length; i++) {
                foodRecipe.push(data.hits[0].recipe.ingredientLines[i]);
            }
            foodCalories = Math.round(data.hits[0].recipe.calories);
            foodImgUrl = data.hits[0].recipe.image;

            for (let i = 1; i < data.hits.length; i++) {
                addFoodTitle.push(data.hits[i].recipe.label);
                addFoodCalories.push(Math.round(data.hits[i].recipe.calories));
                addFoodImgUrl.push(data.hits[i].recipe.image);
                let tempArray = [];
                for (let y = 0; y < data.hits[i].recipe.ingredientLines.length; y++) {
                    tempArray.push(data.hits[i].recipe.ingredientLines[y]);
                }
                addFoodRecipe.push(tempArray);
            }
            res.redirect("/recipe");
        } else {
            foodTitle = "Dish recipe not found!😔";
            res.redirect("/error");
        }
    });
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});


