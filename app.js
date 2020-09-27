import  express from 'express';
import demo from './src/Controllers/demo'
import AuthController from './src/Controllers/AuthController'

const app = express();

const port = process.env.PORT || 3200;

app.use(express.json());
app.use('/demo', demo)
app.use('/auth', AuthController)


app.listen(port, () => {
    console.log(`running on port ${port}`);
})