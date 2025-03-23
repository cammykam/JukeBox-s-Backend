// Load environment variables
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 4000;

// GitHub API details
const GITHUB_PAT = process.env.GITHUB_PAT; // Personal Access Token
const GITHUB_USERNAME = 'cammykam'; // Your GitHub username
const REPO_NAME = 'jukebox-tracks'; // Name of your private repository
const AUDIO_FOLDER = '';

// Route for the root path (/)
app.get('/',(req,res)=>{
    res.send('Welcome to the Jukebox Backend!');
});

// Route to fetch audio tracks
app.get('/audio-tracks', async (req, res) => {
    try {
        console.log('Fetching audio tracks from GitHub...');
        const response = await axios.get(
            `https://api.github.com/repos/cammykam/JukeBox-s-Backend/contents/`,
            {
                headers: {
                    Authorization: `token ${GITHUB_PAT}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        const audioFiles = response.data
            .filter(file => file.name.endsWith('.mp3'))
            .map(file => ({
                name: file.name,
                url: file.download_url,
            }));

        console.log('Audio tracks fetched successfully:', audioFiles);
        res.json(audioFiles);
    } catch (error) {
        console.error('Error fetching audio tracks:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch audio tracks' });
    }
});

// Route to serve individual audio files
app.get('/audio-file/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const response = await axios.get(
            `https://github.com/cammykam/JukeBox/raw/main/`,
            {
                headers: {
                    Authorization: `token ${GITHUB_PAT}`,
                    Accept: 'application/vnd.github.v3.raw',
                },
                responseType: 'stream', // Stream the audio file
            }
        );

        // Set the appropriate content type for audio files
        res.set('Content-Type', 'audio/mpeg');
        // Stream the audio file to the client
        response.data.pipe(res);
    } catch (error) {
        console.error('Error serving audio file:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to serve audio file' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

