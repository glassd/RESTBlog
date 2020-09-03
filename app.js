const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
app = express();

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/RESTBlog", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
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

app.get("/blogs/:id", function(req,res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) console.log(err);
        else res.render('show', {blog: foundBlog});
    })
});

app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err) console.log(err);
        else res.redirect("/blogs/" + req.params.id);
    })
})

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err) console.log(err);
        res.redirect("/blogs");
    })
})

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) console.log(err);
        else res.render('edit', {blog: foundBlog});
    })
})

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if (err) console.log(err)
        else res.redirect("/blogs");
    })
})

app.get("/blogs", function(req, res){
    Blog.find({},function(err, blogs){
        if (err) console.log(err)
        else res.render("index", {blogs: blogs}); 
    }) 
});

app.listen("3000","localhost", function(){
    console.log("Server started on port 3000");
});