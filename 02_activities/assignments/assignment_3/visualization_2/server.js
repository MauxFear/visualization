/**
 * Toronto Crime Map Visualization Server
 * 
 * A simple Node.js server for the Toronto Crime Map visualization.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');

// Configuration
const PORT = 8080;
const DEFAULT_FILE = 'index_main.html';

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.geojson': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Create the HTTP server
const server = http.createServer((req, res) => {
    // Log the request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Parse the URL
    const parsedUrl = url.parse(req.url);
    
    // Handle root URL or redirect to default file
    let pathname = parsedUrl.pathname;
    if (pathname === '/' || pathname === '') {
        pathname = `/${DEFAULT_FILE}`;
    }
    
    // Resolve the file path
    let filePath = path.join(__dirname, pathname);
    
    // Get the file extension
    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'text/plain';
    
    // Read the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found - try the default file
                console.log(`File not found: ${filePath}, trying default file`);
                
                // If the requested file is not found, try serving the default file
                fs.readFile(path.join(__dirname, DEFAULT_FILE), (defaultErr, defaultContent) => {
                    if (defaultErr) {
                        // Default file also not found
                        res.writeHead(404);
                        res.end('404 Not Found');
                        console.error(`Default file also not found: ${DEFAULT_FILE}`);
                    } else {
                        // Serve the default file
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(defaultContent, 'utf-8');
                        console.log(`Served default file: ${DEFAULT_FILE}`);
                    }
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
                console.error(`Server error: ${err.code}`);
            }
        } else {
            // Success - serve the file
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Start the server
server.listen(PORT, () => {
    const serverUrl = `http://localhost:${PORT}/${DEFAULT_FILE}`;
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Opening ${DEFAULT_FILE} in your default browser...`);
    
    // Open the default browser
    const openCommand = process.platform === 'win32' ? 'start' :
                        process.platform === 'darwin' ? 'open' : 'xdg-open';
    
    // Wait a moment before opening the browser
    setTimeout(() => {
        exec(`${openCommand} ${serverUrl}`, (err) => {
            if (err) {
                console.error(`Failed to open browser: ${err}`);
            }
        });
    }, 1000);
    
    console.log(`Press Ctrl+C to stop the server`);
});