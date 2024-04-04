const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const PORT = 3000;
const FILE_PATH = 'tasks.json'; // File to store tasks

app.use(cors());
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Load tasks from file
let tasks = [];

async function loadTasksFromFile() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        tasks = JSON.parse(data);
    } catch (error) {
        console.error('Error loading tasks from file:', error);
    }
}

async function saveTasksToFile() {
    try {
        await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving tasks to file:', error);
    }
}

loadTasksFromFile(); // Load tasks from file on server startup

// Routes
// GET all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST new tasks
app.post('/tasks', (req, res) => {
    try {
        tasks = req.body.map(task => ({ title: task })); // Assuming req.body is an array of strings
        saveTasksToFile(); // Save tasks to file after update
        res.status(201).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bad Request' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
