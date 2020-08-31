const express = require('express');

const app = express();

const bodyparser = require('body-parser');
const demo = require('./Apis/demo')

const port = process.env.PORT || 3200;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.use('/demo', demo)


app.listen(port, () => {
    console.log(`running on port ${port}`);
})