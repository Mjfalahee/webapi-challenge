const express = require('express');
const Actions = require('../data/helpers/actionModel');
const Projects = require('../data/helpers/projectModel');
const router = express.Router();

//Middleware


function ValidateActionId(req, res, next) {
    if (req.params.id) {
        Actions.get(req.params.id)
            .then(action => {
                //console.log(project);
                if (action.description.length > 0) {
                    req.action = action;
                    next();
                }
            })
            .catch(error => {
                //console.log(error);
                res.status(404).json({
                    message: `There is no action with ID: ${req.params.id}.`
                });
            })
    }
}

function ValidateProjectId(req, res, next) {
    if (req.body.project_id) {
        Projects.get(req.body.project_id)
            .then(project => {
                if (project.name.length > 0) {
                    next();
                }
            })
            .catch(error => {
                //console.log(error);
                res.status(404).json({
                    message: `There is no project with ID: ${req.body.project_id}.`
                });
            })
    }
    else {
        res.status(400).json({
            message: 'Actions must have a project id.'
        })
    }
}

function ValidateAction(req, res, next) {
    if (req.body) {
            if (req.body.description) {
                if(req.body.notes) {
                        next();
                }
                else {
                    res.status(400).json({
                        message: 'Actions must have a notes element.'
                    })
                }
            }
            else {
                res.status(400).json({
                    message: 'Actions must have a description.'
                })
            }
        }
    else {
        res.status(400).json({
            message: 'No data provided to add.'
        })
    }
}


//CRUD operations

//get all actions == working

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(error => {
            res.status(500).json({
                message: 'Unable to retrieve actions.'
            })
        })
})

//get specific action == working

router.get('/:id', ValidateActionId, (req, res) => {
    res.status(200).json(req.action);
})

//add action == working

router.post('/', ValidateProjectId, ValidateAction, (req, res) => {
    Actions.insert(req.body)
        .then(action => {
            console.log(action);
            res.status(200).json(action);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error adding the action to the database.'
            })
        })
})

//delete action == working

router.delete('/:id', ValidateActionId, (req, res) => {
    Actions.remove(req.params.id)
        .then(action => {
            console.log(action);
            res.status(200).json({
                message: `${action} Action was successfully removed.`
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Action was unable to be removed.'
            })
        })
})

//update action

module.exports = router;