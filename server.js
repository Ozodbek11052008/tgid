const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your bot's token
const BOT_TOKEN = '5443385906:AAGRle5T_QFRuWuFtKgSwITgvABUyBSRsoM';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Function to check Telegram authorization
function checkAuth(data) {
    const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const checkString = Object.keys(data)
        .filter(key => key !== 'hash')
        .sort()
        .map(key => `${key}=${data[key]}`)
        .join('\n');
    const hash = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
    return hash === data.hash;
}

// Route for handling Telegram login
app.get('/auth', (req, res) => {
    const user = req.query;

    if (checkAuth(user)) {
        // Authentication success, send user ID
        res.send(`
            <html>
                <head><title>Telegram Login</title></head>
                <body>
                    <h1>Welcome, ${user.first_name}!</h1>
                    <p>Your Telegram ID is: <strong>${user.id}</strong></p>
                    <a href="/">Go back</a>
                </body>
            </html>
        `);
    } else {
        res.send('Authorization failed');
    }
});

// Serve the front-end HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
