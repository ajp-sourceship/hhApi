import  express from 'express';
import ColorController from './src/Controllers/ColorController'

var cors = require('cors')
const app = express();


app.use(cors())
app.use(express.json());
app.use('/color', ColorController)


const port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log(`running on port ${port}`);
})