const https = require('https');

const apiKey = "AIzaSyDdcWMQCasxCOuNdXXHEQAEyVyhXEZJu58";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else {
                console.log("Available Models:");
                json.models.forEach(m => console.log(m.name));
            }
        } catch (e) {
            console.error("Parse Error:", e);
            console.log(data);
        }
    });
}).on('error', (err) => {
    console.error("Network Error:", err);
});
