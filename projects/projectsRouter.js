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

//get specific project

router.get('/:id', ValidateProjectId, (req, res) => {
   res.status(200).json(req.project);
})

//add project

//delete project

//update project


module.exports = router;