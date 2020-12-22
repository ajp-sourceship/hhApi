import  express from 'express';
import demo from './src/Controllers/demo'
import AuthController from './src/Controllers/AuthController'
import GateController from './src/Controllers/GateController'
import CustomerControler from './src/Controllers/CustomerController'
import ProjectController from './src/Controllers/ProjectController'
var cors = require('cors')
const app = express();

const port = process.env.PORT || 3200;

app.use(cors())
app.use(express.json());
app.use('/demo', demo)
app.use('/auth', AuthController)
app.use('/gate', GateController)
app.use('/customer', CustomerControler)
app.use('/project', ProjectController)


app.listen(port, () => {
    console.log(`running on port ${port}`);
})