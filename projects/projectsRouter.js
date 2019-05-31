const express = require('express');
const Projects = require('../data/helpers/projectModel');
const router = express.Router();

//Middleware

function ValidateProjectId(req, res, next) {
    if (req.params.id) {
        Projects.get(req.params.id)
            .then(project => {
                //console.log(project);
                if (project.name.length > 0) {
                    req.project = project;
                    next();
                }
            })
            .catch(error => {
                //console.log(error);
                res.status(404).json({
                    message: `There is no project with ID: ${req.params.id}.`
                });
            })
    }
}

function ValidateProject(req, res, next) {
    if (req.body) {
        if (req.body.name && req.body.description) {
            next();
        }
        else {
            res.status(400).json({
                message: 'Projects must have a name, description, and a completed: false to be added to the database.'
            });
        }
    }
    else {
        res.status(400).json({
            message: 'No data provided to add.'
        })
    }
}

//CRUD operations

//get all projects == Working

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error retrieving the projects from the database.'
            });
        })
});

//get specific project == Working

router.get('/:id', ValidateProjectId, (req, res) => {
   res.status(200).json(req.project);
})

//add project == Working

router.post('/', ValidateProject, (req,res) => {
    let temp = req.body;
    Projects.insert(req.body)
        .then(project => {
            console.log(project);
            res.status(200).json({project});
        })
        .catch(error => {
            console.log('Inside post catch.')
            console.log(error);
            res.status(500).json({
                message: 'Error adding the project to the database.'
            })
        })
})

//delete project


//update project


module.exports = router;