const express = require('express');
require('./src/db/mongDb');

const app = express();
const port = process.env.port || 3000;


const userRouter = require('./src/routes/user');
const taskrouter = require('./src/routes/task');

app.use(express.json());
app.use([userRouter, taskrouter]);

app.listen(port, () => {
    console.log('Server is running on Post 3000');
});

