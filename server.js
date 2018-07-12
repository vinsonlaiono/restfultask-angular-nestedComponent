const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static( __dirname + '/public/dist/public' ));

app.listen(port, function () {
    console.log("You are listening on port 5000")
})
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Restfultast');
var UserSchema = new mongoose.Schema({
    title: { type: String, required: [true, "title must be at least 2 characters"], minlength:2 },
    description: { type: String, default: '' , required: [true, "description must be at least 5 characters"], minlength:5},
    completed: { type: Boolean, default: false }
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

// retrieve all task
app.get('/tasks', function (req, res) {
    console.log("Retrieve all task route")
    User.find({}, function (err, users) {
        if (err) {
            console.log("Error: ", err)
            res.json({ message: "Error", error: err })
        } else {
            res.json({ message: "Success", data: users })
        }
    })
})
// Retrieve a Task by ID
app.get('/task/:id/', function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, user) {
        if (err) {
            console.log({ message: "Error", error: err })
        } else {
            res.json({ message: "Success", data: user })
        }
    })
});
// Create a Task
app.post('/task', function (req, res) {
    console.log(req.body)
    User.create({
        title: req.body.title, description: req.body.description, completed: req.body.completed
    }, function (err, user) {
        if(err){
            console.log(err)
            res.json({ message: "Error", error: err })
        } else {
            user.save(function(err){
                if(err){
                    res.json({ message: "Error", error: err })
                } else {
                    res.json({ message: "Success", data: user })
                }
            })
        }
    })
});
// Update a Task by ID
app.put('/task/:id', function (req, res){
    User.findOneAndUpdate({_id: req.params.id}, 
        {$set: {title: req.body.title, description: req.body.description, completed: req.body.completed}}, {multi: false}
        ,function (err, task){
        if(err){
            console.log("Error: " , err)
            res.json({message: "Error", error: err})
        } else{
            
            res.json({message: "success", task: task})
        }
    })
})
// Delete a Task by ID
app.delete('/task/:id/', function (req, res) {
    User.findByIdAndRemove({_id: req.params.id}, function (err, user) {
        if (err) {
            console.log("Error: ", err)
            res.json({ message: "Error", error: err })
        } else {
            res.json({ message: "Success", data: user })
        }
    })
});




