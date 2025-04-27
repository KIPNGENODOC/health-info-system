// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory storage
let programs = [];
let clients = [];

// Create a health program
app.post('/programs', (req, res) => {
    const { name } = req.body;
    const program = { id: programs.length + 1, name };
    programs.push(program);
    res.status(201).json(program);
});

// Register a new client
app.post('/clients', (req, res) => {
    const { name, age } = req.body;
    const client = { id: clients.length + 1, name, age, enrolledPrograms: [] };
    clients.push(client);
    res.status(201).json(client);
});

// Enroll client to programs
app.post('/clients/:clientId/enroll', (req, res) => {
    const { clientId } = req.params;
    const { programIds } = req.body;

    const client = clients.find(c => c.id == clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    client.enrolledPrograms.push(...programIds);
    res.json(client);
});

// Search clients
app.get('/clients', (req, res) => {
    const { search } = req.query;
    const results = search
        ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        : clients;
    res.json(results);
});

// View client profile
app.get('/clients/:clientId', (req, res) => {
    const { clientId } = req.params;
    const client = clients.find(c => c.id == clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const enrolledPrograms = client.enrolledPrograms.map(id => programs.find(p => p.id === id));
    res.json({ ...client, enrolledPrograms });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
