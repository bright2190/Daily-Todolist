//jshint esversion:6

const express =  require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");   //here we are requiring a file of javascript code to perform a paarticular function for the users display.
const ejs = require("ejs");
const cors = require("cors");
const dotenv = require("dotenv");
const createError = require("http-errors");
const mongoose = require("mongoose");
const { list } = require("parser");
const _ = require("lodash");

const app = express();



// View engine setup
app.set('view engine', 'ejs');      //tell our App that ejs has beem install and ready to be used
app.use(bodyParser.urlencoded({extended: true}, {async: true}));       //we are using  body parser because of the "app.post"
app.use(express.static("public"));      // this app.use allows the server pass in all the css files, images, boostrap files and other files into the servers to the web page for the user display
app.use(express.json())         //with this we just intiallize "body-parser in our server"
app.use(cors());


//connecting our app.js with mongoDB Server i.e configuring the dotenv file
dotenv.config()

//using the dotenv pacakge to access out databse
mongoose.connect(process.env.Database_access, () => console.log("Database is connected successfully"), {useNewUrlParser: true, useUnifiedTopology: true,});




//using the dotenv pacakge to access out databse, i.e this is our Mongoose Schema
//We are creating a new schema (ITEM) for our  home route ("/")
const itemsSchema = {
    name: String
}; 

//this is our mongoose model based on our schema for Items
const Item = mongoose.model("item", itemsSchema)



// this is how we create a new mongoose document that is linked to our mongoose model
const item1 = new Item({
    name: "Nigeria"
});
const item2 = new Item({
    name: "Ghana"
});
const item3 = new Item({
    name: "South Africa"
});


const defaultItems = [item1, item2, item3];


//using the dotenv pacakge to access out databse, i.e this is our Mongoose Schema
//We are creating a new schema (LIST )for our customizedPagename ("work")
const listSchema = {
    name: String,
    items: [itemsSchema]
}; 

//this is our mongoose model based on our schema for list
const List = mongoose.model("List", listSchema)





//this is LANDING home page
app.get("/", async function(req, res) {

    Item.find({}, function(err, foundItems){     // this block of code will find the defaultItems in the landing page
        
    if (foundItems.length === 0) {
         Item.insertMany(defaultItems, function(err) {        //inserting all items into an Array, we do this
             if (err) {
                 console.log(err);
                } else {
             console.log("Successfully saved default items to Database")
         }
        });
        

        } else {
            res.render("list", {listTitle: day, newListItems: foundItems});            // we use res.render when using <%= %> for the response and request
        }
    });

    let day = date.getDate();
    
});



// this app.post("/") provide the landing page. its also shows the data typed in by the user. 

app.post("/", async function(req, res) {
    
    const itemName = req.body.newItem;
    const listName = req.body.list;

    // creating a new item document for each new item that will entered by the user
    const  item = new Item ({ name: itemName});
    
    //In this block of code we making sure that for every new item inputted by the user will be properly stored in the right landing page
    if (listName === "Today") {
        item.save();            //this is to save every new item
        res.redirect("/");      // this is make sure that the new item show in our landing page of other items
    } else {
        List.findOne({name: listName}, async function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
    
});



// This is our express Route parameter. it is used to create dynamic landing pages
//this route is route to target a new page attached to the main page.

app.get("/:customizedPageName", async function(req, res) {
    const customizedPageName = _.capitalize(req.params.customizedPageName);

    // this block of code is trying to see if the customizedPageName exist already
    
    List.findOne({name: customizedPageName}, async function(err, foundList) {
       if (!err) {
        if (!foundList) {
            // because customizedPageName doesn't exist we then proceed to:
            //  create a new mongoose document for (LIST) that is linked to our mongoose model for LIST, after we've clearified that the customizedPageName doesnt exist
                    const list = new List({
                        name: customizedPageName,
                        // items: defaultItems NB: i dont what the defaultItems to be listed in the new custtomizedPageName.
                    });

                    list.save();
                    res.redirect("/" + customizedPageName);
                } else {
                //show an exist list

                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
                
            

                }
            }
    });


    
});




//this app.post("/delete") provide the user the ability to be able to delete any input he/she typed
app.post("/delete", async function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove({checkedItemId}, async function(err) {
            if (!err) {
                console.log("successfully deleted checked item");
                res.redirect("/")
            };
    });
    } 
    else {
        // in this block of code we are trying to specifically delete any item we want in any of the customizedPageName    
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, async function(err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
    
});




//this is landing page for contact page.ejs
app.get("/contact", async function(req, res) {
    res.render("contact");
});





app.listen(3000, function() {
    console.log("server is running on port 3000");
});