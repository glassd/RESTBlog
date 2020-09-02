const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app = express();

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/RESTBlog", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    created: {type: Date, default: Date.now}
})
const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req,res){
    res.redirect("/blogs");
})
//Restfull ROUTES
//Index Route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if (err) console.log(err)
        else res.redirect("/blogs");
    })
})

app.get("/blogs", function(req, res){
    Blog.find({},function(err, blogs){
        if (err) console.log(err)
        else {
            res.render("index", {blogs: blogs}); 
        }
    }) 
});

app.listen("3000","localhost", function(){
    console.log("Server started on port 3000");
});