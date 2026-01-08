require("dotenv").config();
const express = require('express');
const {conneccttoDB} = require('./db/mongo');
const app = express();
app.use(express.json());

async function startServer(){
    const db = await connecttoDB();
    const authRoutes = require('./routes/auth')(db);
    app.use('/auth', authRoutes);

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

startServer();