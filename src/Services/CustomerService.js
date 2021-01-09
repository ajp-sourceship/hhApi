import moment from "moment";
const sql = require('mssql')




export const GetCustomerLocations = async (req) => {
    let customerId = req.user.userData.userInfo[0].CustomerImpersonationId;
    await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')

    const locations = await sql.query`
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
    Select 
        GPSTrackingLocation.LocationId,
        GPSTrackingLocation.LocationName, 
        GPSTrackingLocation.Address, 
        GPSTrackingLocation.City,
        GPSTrackingLocation.State,
        GPSTrackingLocation.PostalCode,
        GPSTrackingLocation.Latitude, 
        GPSTrackingLocation.Longitude
        From GPSTrackingLocation 
        Join customerIds on GPSTrackingLocation.CustomerId = customerIds.CrossRefId
            `
    let returnVal = {
        Locations: locations.recordset
    }
    return returnVal

}