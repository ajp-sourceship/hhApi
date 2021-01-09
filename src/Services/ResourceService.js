import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import moment from "moment";
import globals from "../../globals";
const sql = require('mssql')

export const GetCustomerResources = async (req) => {
    let isAuthed = req.user.userData.userPermissions.some(perm => perm.PermissionCode === 'GPSLIST');
    if (isAuthed) {
        let customerId = req.user.userData.userInfo[0].CustomerImpersonationId;
        try {
            await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')
            const resources = await sql.query`
            Declare @customerId int = ${customerId};

            With customerIds as ( 
                Select 
                    Customer.CustomerId,
                    Customer.CustomerKey,
                    Customer.CustomerName,
                    Customer.MarkerColor,
                    Customer.BusinessUnit,
                    Customer.CustomerRegion,
                    Customer.CustomerId CrossRefId
                from 
                    Customer 
                where 
                    Customer.CustomerId = @customerId
                Union
                Select 
                    Customer.CustomerId,
                    Child.CustomerKey,
                    Child.CustomerName,
                    Child.MarkerColor,
                    Child.BusinessUnit,
                    Child.CustomerRegion,
                    CustomerCrossRef.CrossRefId 
                from 
                    Customer 
                    Join CustomerCrossRef on 
                        Customer.CustomerId = CustomerCrossRef.CustomerId
                    Join Customer Child on 
                        CustomerCrossRef.CrossRefId = Child.CustomerId
                where 
                    Customer.CustomerId = @customerId
            )
            Select * From ResourceLink 
                Join customerIds on ResourceLink.CustomerId = customerIds.CrossRefId
`
            let returnVal = {
                Resources: resources.recordset,
            }
            console.log(returnVal);
            return returnVal
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        console.log('fuck')
    }



}

