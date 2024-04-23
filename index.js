const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 4000;
const port2 = 4001;

const server2 = http.createServer((req, res) => {
    if (req.url === '/shared-worker-auth.js') {
        fs.readFile('shared-worker-auth.js', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading shared-worker.js');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });

        return;
    }

    fs.readFile('index2.html', (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
            return;
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

const server = http.createServer((req, res) => {
    // Настройка CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        // Отправка разрешающих заголовков без тела ответа
        res.writeHead(204);
        res.end();
        return;
    }

    // Проверка URL
    console.log('eq.url', req.url + '123', req.url === '/420')
    if (req.url === '/403') {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('403 Forbidden: You do not have access to this resource.');
    } else if (req.url === '/422') {
        res.statusCode = 422;
        res.setHeader('Content-Type', 'application/json'); // Правильный MIME-тип для JSON
        const errorResponse = {
            message: ["Error message 1", "Error message 2"] // Пример массива сообщений об ошибках
        };
        res.end(JSON.stringify(errorResponse));
    } else if (req.url === '/shared-worker.js') {
        fs.readFile('shared-worker.js', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading shared-worker.js');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    } else if (req.url === '/shared-worker-auth.js') {
        fs.readFile('shared-worker-auth.js', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading shared-worker.js');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    } else if (req.url === '/index.html') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello, World!\n');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

server2.listen(port2, hostname, () => {
    console.log(`Server running at http://${hostname}:${port2}/`);
});