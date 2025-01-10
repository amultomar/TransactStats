const express = require('express');
const path = require('path');

const app = express();

// Serve the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Route for the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
