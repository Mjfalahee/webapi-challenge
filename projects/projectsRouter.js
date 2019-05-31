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

//CRUD requests\\

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

//delete project == Working

router.delete('/:id', ValidateProjectId, (req, res) => {
    Projects.remove(req.params.id)
        .then(project => {
            console.log(project);
            res.status(200).json({
                message: `${project} Project successfully removed.`
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Project was unable to be removed.'
            })
        })
})

//update project == Working

router.put('/:id', ValidateProjectId, ValidateProject, (req, res) => {
    Projects.update(req.params.id, req.body)
        .then(project => {
            console.log(project);
            res.status(200).json({project});
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Project was unable to be updated.'
            })
        })
})

//get the actions for a specific project == Working

router.get('/:id/actions', ValidateProjectId, (req, res) => {
    Projects.getProjectActions(req.params.id)
        .then(actions => {
                console.log(actions);
                res.status(200).json(actions);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: `Error retrieving the actions associated with project ${req.params.id}`
            });
        })
})


module.exports = router;