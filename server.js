// Load environment variables
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// GitHub API details
const GITHUB_PAT = process.env.GITHUB_PAT; // Personal Access Token
const GITHUB_USERNAME = 'cammykam'; // Your GitHub username
const REPO_NAME = 'JukeBox'; // Name of your private repository
const AUDIO_FOLDER = '';

// Endpoint to fetch audio tracks
app.get('/audio-tracks', async (req, res) => {
    try {
        // Fetch the list of files from the private repository
        const response = await axios.get(
            `https://api.github.com/repos/cammykam/JukeBox/contents/`,
            {
                headers: {
                    Authorization: `token ${GITHUB_PAT}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        // Filter for audio files (e.g., .mp3)
        const audioFiles = response.data
            .filter(file => file.name.endsWith('.mp3')) // Adjust file extension as needed
            .map(file => ({
                name: file.name,
                url: file.download_url, // GitHub provides a direct download URL
            }));

        // Send the audio file details to the frontend
        res.json(audioFiles);
    } catch (error) {
        console.error('Error fetching audio tracks:', error);
        res.status(500).json({ error: 'Failed to fetch audio tracks' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});