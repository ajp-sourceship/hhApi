import  express from 'express';
import demo from './src/Apis/demo'

const app = express();

const port = process.env.PORT || 3200;

app.use(express.json());
app.use('/demo', demo)


app.listen(port, () => {
    console.log(`running on port ${port}`);
})