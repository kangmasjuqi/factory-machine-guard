require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const corsOptions = require('./config/corsOptions');
const path = require('path');
const fs = require('fs');

const app = express();

// Enhanced CORS options for audio files
const audioCorsOptions = {
  origin: true, // Allow all origins for audio files
  credentials: true,
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length']
};

app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working', timestamp: new Date() });
});

// Enhanced audio route handler with proper headers
app.get('/audios/:filename', cors(audioCorsOptions), (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'audios', filename);
    
    console.log('=== AUDIO REQUEST ===');
    console.log('Requested file:', filename);
    console.log('Full path:', filePath);
    console.log('__dirname:', __dirname);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log('File not found');
        try {
            console.log('Directory contents:', fs.readdirSync(path.join(__dirname, '..', 'audios')));
        } catch (err) {
            console.log('Cannot read directory:', err.message);
        }
        return res.status(404).json({ error: 'File not found' });
    }

    // Get file stats
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Set appropriate content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypeMap = {
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.m4a': 'audio/mp4',
        '.ogg': 'audio/ogg',
        '.flac': 'audio/flac'
    };
    
    const contentType = contentTypeMap[ext] || 'audio/wav';
    
    // Handle range requests (for seeking)
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Range'
        };
        
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        // Send entire file
        const head = {
            'Content-Length': fileSize,
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Cache-Control': 'public, max-age=86400' // Cache for 1 day
        };
        
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
    
    console.log('File served successfully');
});

// Options handler for audio files
app.options('/audios/:filename', cors(audioCorsOptions), (req, res) => {
    res.sendStatus(200);
});

// API routes
app.use('/api', routes);

// Error handler should be last
app.use(errorHandler);

module.exports = app;