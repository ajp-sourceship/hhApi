import  express from 'express';
import demo from './src/Controllers/demo'
import AuthController from './src/Controllers/AuthController'
import TrackingController from './src/Controllers/TrackingController'
import CustomerControler from './src/Controllers/CustomerController'
import AccountController from './src/Controllers/AccountController'
import LanternController from './src/Controllers/LanternController'
var cors = require('cors')
const app = express();

const port = process.env.PORT || 3200;

app.use(cors())
app.use(express.json());
app.use('/demo', demo)
app.use('/auth', AuthController)
app.use('/tracking', TrackingController)
app.use('/customer', CustomerControler)
app.use('/account', AccountController)
app.use('/lantern', LanternController)


app.listen(port, () => {
    console.log(`running on port ${port}`);
})