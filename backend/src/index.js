const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors')

const app = express();

mongoose.connect('mongodb+srv://gilson:gil123@cluster0-bjv45.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Cadastrar que todas as requisições em formato JSON
// app.use(cors({ origin: 'http://localhost:3000 '}));
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);
