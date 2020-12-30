import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import moment from "moment";
import globals from "../../globals";
const sql = require('mssql')


export const GetAdminLanternManifests = async (req) => {
    try {
        await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')
        const userTrackings = await sql.query`
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
            GPSTracking.TrackingId,
            GPSTracking.CustomerId,
            GPSTracking.DepartueDate, 
            GPSTracking.DestinationDate,
            GPSTracking.DestinationLocationName,
            GPSTrackingEventStatus.EventStatusName,
            GPSTracking.FinalizeDate,
            customerIds.CustomerName, 
            GPSTracking.DateAdded RequestDate,
            LastLocation.EventDate LastPingDate,
            LastLocation.EventLocation LastPingLocation,
            LastLocation.MilesRemaining,
            LastLocation.Comments,
            LastLocation.IsPinging,
            LastLocation.IsDeleted,
            LastLocation.CustomerUpdated,
            LastLocation.TrackerData,
            LastLocation.Longitude,
            LastLocation.Latitude,
            GPSDeviceType.DeviceTypeName + ':' +  GpsDevice.DeviceName FullDeviceName,
            GPSDevice.IMEI, 
            LastLocation.LastBatteryPercentage,
            GPSDeviceType.DeviceTypeName DeviceType,
            LastLocation.Direction,
            LastLocation.Temperature,
            LastLocation.Pressure,

            LastLocation.Light,
            LastLocation.Tilt,
            LastLocation.Humidity,
            LastLocation.Altitude,
            LastLocation.LastMessage,
            customerIds.MarkerColor,
            customerIds.BusinessUnit,
            customerIds.CustomerRegion,
            LastLocation.RequestCod,
            LastLocation.Deviation,
            GPSTracking.DepartureLocationName DepartureLocation,
            GPSTracking.DestinationLocationName FinalDestinationLocation,
            GpsTracking.TrackingDetails
        from 
            customerIds
            Join GPSTracking on 
                customerIds.CrossRefId = GPSTracking.CustomerId
            Join GPSDevice on 
                GPSTracking.DeviceId = GPSDevice.DeviceId
            Join GPSDeviceType on 
                GPSDevice.DeviceTypeId = GPSDeviceType.DeviceTypeId
            Left Join LastLocation on 
                GPSTracking.TrackingId = LastLocation.TrackingId
            Left Join GPSTrackingEventStatus on 
                GPSTrackingEventStatus.EventStatusId = GPSTracking.StatusId

        where 
            StatusId in (1, 2) `

        console.log(userTrackings);
        let returnVal = {
            trackings: userTrackings.recordset,
        }
        console.log(returnVal);
        return returnVal
    }
    catch (err) {
        console.log(err);
    }
    // }
    // else
    // {
    //     console.log('fuck')
    // }



}
export const GetTrackingInfo = async (req) => {
    let customerId = req.user.userData.userInfo[0].CustomerImpersonationId;
    if (req.user.userData.userPermissions.includes(perm => perm.PermissionCode === 'GPSLIST')) {
        try {
            await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')
            const adminsManifests = await sql.query`
        Declare @customerId int = ${customerId};

                With customerIds as ( 
                       Select 
                              Customer.CustomerId,
                              Customer.CustomerKey,
                              Customer.CustomerName,
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
                              CustomerCrossRef.CrossRefId

                       from 
                              Customer 
                              Join CustomerCrossRef on 
                                     Customer.CustomerId = CustomerCrossRef.CustomerId
                              Join Customer Child on 
                                     CustomerCrossRef.CrossRefId = Child.CustomerId
                       where 
                              Customer.CustomerId = @customerId
                ),

                UsersLanternItems as 
                (
					Select 
						LanternManifest.LanternManifestId,
						LanternManifest.CreatedDateTime,
						LanternManifest.DeliveryStartWindow,
						LanternManifest.DeliveryEndWindow,
						LanternStatus.StatusName,
						Account.FirstName + ' ' + Account.LastName CourierName , 
						Customer.CustomerName,
						Customer.CustomerKey
						
						From LanternManifest
								Join customerIds on LanternManifest.CustomerId = customerIds.CrossRefId
								Join LanternStatus on LanternManifest.ManifestStatusId = LanternStatus.LanternStatusId
								Join Account on LanternManifest.CourierAccountId  = Account.AccountId 
								Join Customer on Account.CustomerId = Customer.CustomerId
								

	                Group By
			          
						
						LanternManifest.LanternManifestId,
						LanternManifest.CreatedDateTime,
						LanternManifest.DeliveryStartWindow,
						LanternManifest.DeliveryEndWindow,
						LanternStatus.StatusName,
						Account.FirstName + ' ' + Account.LastName, 
						Customer.CustomerName,
						Customer.CustomerKey
						
						
       
                )

                Select * From UsersLanternItems;
        `
            const adminParcels = await sql.query`
        Declare @customerId int = ${customerId};

        With customerIds as ( 
               Select 
                      Customer.CustomerId,
                      Customer.CustomerKey,
                      Customer.CustomerName,
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
                      CustomerCrossRef.CrossRefId

               from 
                      Customer 
                      Join CustomerCrossRef on 
                             Customer.CustomerId = CustomerCrossRef.CustomerId
                      Join Customer Child on 
                             CustomerCrossRef.CrossRefId = Child.CustomerId
               where 
                      Customer.CustomerId = @customerId
        ),

        UsersLanternItems as 
        (
            Select 
                LanternManifestItem.LanternQrCode, 
                LanternManifestItem.ManifestItemId,
                LanternManifest.LanternManifestId,
                LanternManifest.CreatedDateTime,
                LanternManifest.DeliveryStartWindow,
                LanternManifest.DeliveryEndWindow,
                LanternStatus.StatusName,
                Account.FirstName + ' ' + Account.LastName CourierName , 
                Customer.CustomerName,
                Customer.CustomerKey,
                LanternManifestItem.StartLocationName, 
                LanternManifestItem.EndLocationName, 
                LanternManifestItem.StartLatitude, 
                LanternManifestItem.StartLongitude, 
                LanternManifestItem.StartDateTime, 
                LanternManifestItem.EndLongitude, 
                LanternManifestItem.EndLatitude, 
                LanternManifestItem.EndDateTime, 
                LanternManifestItem.RouteCoors, 
                LanternManifestItem.RouteMarkers,
                LanternManifestItem.RouteDistance, 
                LanternManifestItem.TransitTime, 
                LanternQrImage.Base64String DeliveryBase64 


                From LanternManifestItem 
                        Join LanternManifest_ManifestItem on LanternManifest_ManifestItem.ManifestItemId = LanternManifestItem.ManifestItemId
                        Join LanternManifest on LanternManifest_ManifestItem.ManifestId = LanternManifest.LanternManifestId
                        Join LanternStatus on LanternManifest.ManifestStatusId = LanternStatus.LanternStatusId
                        Join Account on LanternManifest.CourierAccountId  = Account.AccountId 
                        Join Customer on Account.CustomerId = Customer.CustomerId
                        Left Join LanternQrImage on LanternQrImage.LanternQrImgId = LanternManifestItem.DeliveryImageId 

            Group By
                   LanternManifestItem.LanternQrCode, 
                LanternManifestItem.ManifestItemId,
                LanternManifest.LanternManifestId, 
                LanternManifest.LanternManifestId,
                LanternManifest.CreatedDateTime,
                LanternManifest.DeliveryStartWindow,
                LanternManifest.DeliveryEndWindow,
                LanternStatus.StatusName,
                Account.FirstName, Account.LastName,
                Customer.CustomerName,
                Customer.CustomerKey,
                LanternManifestItem.StartLocationName, 
                LanternManifestItem.EndLocationName, 
                LanternManifestItem.StartLatitude, 
                LanternManifestItem.StartLongitude, 
                LanternManifestItem.StartDateTime, 
                LanternManifestItem.EndLongitude, 
                LanternManifestItem.EndLatitude, 
                LanternManifestItem.EndDateTime, 
                LanternManifestItem.RouteCoors, 
                LanternManifestItem.RouteMarkers,
                LanternManifestItem.RouteDistance, 
                LanternManifestItem.TransitTime, 
                LanternQrImage.Base64String 

        )

        Select * From UsersLanternItems
        
Order By 
UsersLanternItems.CreatedDateTime
        `
            const adminDailyRoute = await sql.query`
        Declare @customerId int = ${customerId};
With customerIds as ( 
       Select 
              Customer.CustomerId,
              Customer.CustomerKey,
              Customer.CustomerName,
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
              CustomerCrossRef.CrossRefId

       from 
              Customer 
              Join CustomerCrossRef on 
                     Customer.CustomerId = CustomerCrossRef.CustomerId
              Join Customer Child on 
                     CustomerCrossRef.CrossRefId = Child.CustomerId
       where 
              Customer.CustomerId = @customerId
),

UsersLanternManifest as 
(
       Select 
			--LanternManifest.LanternManifestId, 
			--LanternManifest.CreatedDateTime,
			--LanternManifest.DeliveryStartWindow, 
			--LanternManifest.DeliveryEndWindow,
			--Account.FirstName + ' ' +  SUBSTRING(Account.LastName, 1,1) + '.' CourierName,
			
			LanternEvent.LanternManifestId, 
			LanternEvent.RemainingParcels, 
			LanternEvent.Accuracy accuracy,
			LanternEvent.Longitude longitude,
			LanternEvent.Latitude latitude,
			LanternEvent.Altitude altitude,
			LanternEvent.Heading heading,
			LanternEvent.BatteryLevel batteryLevel,
			LanternEvent.MoveType moveType,
			LanternEvent.PingDateTime pingDateTime,
			LanternManifest.CreatedDateTime createdDateTime,
			Account.FirstName + ' ' +  Account.LastName  CourierName

			
       From 

              LanternManifest
		
            Join customerIds on 
				LanternManifest.CustomerId = customerIds.CrossRefId
			Join Account on 
				LanternManifest.CourierAccountId = Account.AccountId
			Join LanternStatus on 
				LanternStatus.LanternStatusId = LanternManifest.ManifestStatusId
			Join LanternManifest_ManifestItem on
				LanternManifest_ManifestItem.ManifestId = LanternManifest.LanternManifestId
			Join LanternManifestItem on 
				LanternManifestItem.ManifestItemId = LanternManifest_ManifestItem.ManifestItemId
			Join LanternEvent on 
				LanternEvent.LanternManifestId = LanternManifest.LanternManifestId
	
	
	Group By
			LanternManifest.LanternManifestId, 
			LanternManifest.CreatedDateTime,
			Account.FirstName + ' ' +  Account.LastName ,
			LanternEvent.LanternManifestId, 
			LanternEvent.RemainingParcels, 
			LanternEvent.Accuracy,
			LanternEvent.Longitude,
			LanternEvent.Latitude,
			LanternEvent.Altitude,
			LanternEvent.Heading,
			LanternEvent.BatteryLevel,
			LanternEvent.MoveType,
			LanternEvent.PingDateTime
	   
)

Select * From UsersLanternManifest
Where  UsersLanternManifest.pingDateTime BETWEEN DATEADD(d,-2,CURRENT_TIMESTAMP) AND CURRENT_TIMESTAMP
Order By 
		UsersLanternManifest.pingDateTime

        `
            let returnVal = {
                Manifests: adminsManifests.recordset,
                Parcels: adminParcels.recordset,
                Route: adminDailyRoute.recordset
            }
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


export const GetAllManifests = async (req) => {
    let customerId = req.user.userData.userInfo[0].CustomerImpersonationId;
    // if (req.user.userData.userPermissions.includes(perm => perm.PermissionCode === 'LANTERNADMIN')) {
        try {
            await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')
            const userTrackings = await sql.query`
        Declare @customerId int = ${customerId};
        With customerIds as ( 
               Select 
                      Customer.CustomerId,
                      Customer.CustomerKey,
                      Customer.CustomerName,
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
                      CustomerCrossRef.CrossRefId
        
               from 
                      Customer 
                      Join CustomerCrossRef on 
                             Customer.CustomerId = CustomerCrossRef.CustomerId
                      Join Customer Child on 
                             CustomerCrossRef.CrossRefId = Child.CustomerId
               where 
                      Customer.CustomerId = @customerId
        ),
        
        UsersLanternManifest as 
        (
               Select 
                    LanternManifest.LanternManifestId, 
                    LanternManifest.CreatedDateTime,
                    LanternManifest.DeliveryStartWindow, 
                    LanternManifest.DeliveryEndWindow,
                    Account.FirstName + ' ' +  SUBSTRING(Account.LastName, 1,1) + '.' CourierName,
                    LanternStatus.StatusName, 
                    (Select Count(LanternManifest_ManifestItem.LTManifestId) From LanternManifest_ManifestItem Where LanternManifest_ManifestItem.ManifestId = LanternManifest.LanternManifestId) ParcelCount
               From 
        
                      LanternManifest
                    Join customerIds on 
                        LanternManifest.CustomerId = customerIds.CrossRefId
                    Join Account on 
                        LanternManifest.CourierAccountId = Account.AccountId
                    Join LanternStatus on 
                        LanternStatus.LanternStatusId = LanternManifest.ManifestStatusId
        
            Group By
                    LanternManifest.LanternManifestId, 
                    LanternManifest.CreatedDateTime,
                    Account.FirstName + ' ' +  SUBSTRING(Account.LastName, 1,1) + '.',
                    LanternManifest.DeliveryStartWindow, 
                    LanternManifest.DeliveryEndWindow,
                    LanternStatus.StatusName
               
        )
        
        Select
			*
				From
					UsersLanternManifest
				Order By 
					UsersLanternManifest.LanternManifestId Desc;`

            return userTrackings.recordset
        }
        catch (err) {
            console.log(err);
        }
    // }
    // else {
    //     console.log('fuck')
    // }



}



export const GetManifest = async (req) => {
    let customerId = req.user.userData.userInfo[0].CustomerImpersonationId;
    // if(req.user.userData.userPermissions.includes(perm => perm.PermissionCode === 'GPSLIST'))
    // {
    try {
        let manId = req.body.manifestId
        await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')
        const manifest = await sql.query`
        Declare @customerId int = ${customerId};

        With customerIds as ( 
               Select 
                      Customer.CustomerId,
                      Customer.CustomerKey,
                      Customer.CustomerName,
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
                      CustomerCrossRef.CrossRefId

               from 
                      Customer 
                      Join CustomerCrossRef on 
                             Customer.CustomerId = CustomerCrossRef.CustomerId
                      Join Customer Child on 
                             CustomerCrossRef.CrossRefId = Child.CustomerId
               where 
                      Customer.CustomerId = @customerId
        ),

        UsersLanternItems as 
        (
            Select 
                LanternManifest.LanternManifestId,
                LanternManifest.CreatedDateTime,
                LanternManifest.DeliveryStartWindow,
                LanternManifest.DeliveryEndWindow,
                LanternStatus.StatusName,
                Account.FirstName + ' ' + Account.LastName CourierName , 
                Customer.CustomerName,
                Customer.CustomerKey
                
                From LanternManifest
                        Join customerIds on LanternManifest.CustomerId = customerIds.CrossRefId
                        Join LanternStatus on LanternManifest.ManifestStatusId = LanternStatus.LanternStatusId
                        Join Account on LanternManifest.CourierAccountId  = Account.AccountId 
                        Join Customer on Account.CustomerId = Customer.CustomerId
                        
                Where LanternManifest.LanternManifestId = ${manId}

            Group By
              
                
                LanternManifest.LanternManifestId,
                LanternManifest.CreatedDateTime,
                LanternManifest.DeliveryStartWindow,
                LanternManifest.DeliveryEndWindow,
                LanternStatus.StatusName,
                Account.FirstName + ' ' + Account.LastName, 
                Customer.CustomerName,
                Customer.CustomerKey
                
                

        )

        Select * From UsersLanternItems;`


        const parcels = await sql.query`
        Declare @customerId int = ${customerId};

        With customerIds as ( 
               Select 
                      Customer.CustomerId,
                      Customer.CustomerKey,
                      Customer.CustomerName,
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
                      CustomerCrossRef.CrossRefId

               from 
                      Customer 
                      Join CustomerCrossRef on 
                             Customer.CustomerId = CustomerCrossRef.CustomerId
                      Join Customer Child on 
                             CustomerCrossRef.CrossRefId = Child.CustomerId
               where 
                      Customer.CustomerId = @customerId
        ),

        UsersLanternItems as 
        (
            Select 
                LanternManifestItem.LanternQrCode, 
                LanternManifestItem.ManifestItemId,
                LanternManifest.LanternManifestId,
                LanternManifest.CreatedDateTime,
                LanternManifest.DeliveryStartWindow,
                LanternManifest.DeliveryEndWindow,
                LanternStatus.StatusName,
                Account.FirstName + ' ' + Account.LastName CourierName , 
                Customer.CustomerName,
                Customer.CustomerKey,
                LanternManifestItem.StartLocationName, 
                LanternManifestItem.EndLocationName, 
                LanternManifestItem.StartLatitude, 
                LanternManifestItem.StartLongitude, 
                LanternManifestItem.StartDateTime, 
                LanternManifestItem.EndLongitude, 
                LanternManifestItem.EndLatitude, 
                LanternManifestItem.EndDateTime, 
                LanternManifestItem.RouteCoors, 
                LanternManifestItem.RouteMarkers,
                LanternManifestItem.RouteDistance, 
                LanternManifestItem.TransitTime, 
                LanternManifestItem.RequiresSignature RequireSignatureBool,
                LanternQrImage.Base64String DeliveryBase64 


                From LanternManifestItem 
                        Join LanternManifest_ManifestItem on LanternManifest_ManifestItem.ManifestItemId = LanternManifestItem.ManifestItemId
                        Join LanternManifest on LanternManifest_ManifestItem.ManifestId = LanternManifest.LanternManifestId
                        Join LanternStatus on LanternManifest.ManifestStatusId = LanternStatus.LanternStatusId
                        Join Account on LanternManifest.CourierAccountId  = Account.AccountId 
                        Join Customer on Account.CustomerId = Customer.CustomerId
                        Left Join LanternQrImage on LanternQrImage.LanternQrImgId = LanternManifestItem.DeliveryImageId 
            Where LanternManifest.LanternManifestId = ${manId}

            Group By
                   LanternManifestItem.LanternQrCode, 
                LanternManifestItem.ManifestItemId,
                LanternManifest.LanternManifestId, 
                LanternManifest.LanternManifestId,
                LanternManifest.CreatedDateTime,
                LanternManifest.DeliveryStartWindow,
                LanternManifest.DeliveryEndWindow,
                LanternStatus.StatusName,
                Account.FirstName, Account.LastName,
                Customer.CustomerName,
                Customer.CustomerKey,
                LanternManifestItem.StartLocationName, 
                LanternManifestItem.EndLocationName, 
                LanternManifestItem.StartLatitude, 
                LanternManifestItem.StartLongitude, 
                LanternManifestItem.StartDateTime, 
                LanternManifestItem.EndLongitude, 
                LanternManifestItem.EndLatitude, 
                LanternManifestItem.EndDateTime, 
                LanternManifestItem.RouteCoors, 
                LanternManifestItem.RouteMarkers,
                LanternManifestItem.RouteDistance, 
                LanternManifestItem.TransitTime, 
                LanternQrImage.Base64String,
                LanternManifestItem.RequiresSignature 

        )

        Select * From UsersLanternItems
        `


        const route = await sql.query`
        Declare @customerId int = ${customerId};
        With customerIds as ( 
               Select 
                      Customer.CustomerId,
                      Customer.CustomerKey,
                      Customer.CustomerName,
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
                      CustomerCrossRef.CrossRefId
        
               from 
                      Customer 
                      Join CustomerCrossRef on 
                             Customer.CustomerId = CustomerCrossRef.CustomerId
                      Join Customer Child on 
                             CustomerCrossRef.CrossRefId = Child.CustomerId
               where 
                      Customer.CustomerId = @customerId
        ),
        
        UsersLanternManifest as 
        (
               Select 
                    --LanternManifest.LanternManifestId, 
                    --LanternManifest.CreatedDateTime,
                    --LanternManifest.DeliveryStartWindow, 
                    --LanternManifest.DeliveryEndWindow,
                    --Account.FirstName + ' ' +  SUBSTRING(Account.LastName, 1,1) + '.' CourierName,
                    
                    LanternEvent.LanternManifestId, 
                    LanternEvent.Accuracy accuracy,
                    LanternEvent.Speed speed,
                    LanternEvent.Longitude longitude,
                    LanternEvent.Latitude latitude,
                    LanternEvent.Altitude altitude,
                    LanternEvent.Heading heading,
                    LanternEvent.BatteryLevel batteryLevel,
                    LanternEvent.MoveType moveType,
                    LanternEvent.EventNote pingEvent,
                    LanternEvent.PingDateTime pingDateTime,
                    LanternManifest.CreatedDateTime createdDateTime,
                    Account.FirstName + ' ' +  Account.LastName  CourierName
        
                    
               From 
        
                      LanternManifest
                
                    Join customerIds on 
                        LanternManifest.CustomerId = customerIds.CrossRefId
                    Join Account on 
                        LanternManifest.CourierAccountId = Account.AccountId
                    Join LanternStatus on 
                        LanternStatus.LanternStatusId = LanternManifest.ManifestStatusId
                    Join LanternManifest_ManifestItem on
                        LanternManifest_ManifestItem.ManifestId = LanternManifest.LanternManifestId
                    Join LanternManifestItem on 
                        LanternManifestItem.ManifestItemId = LanternManifest_ManifestItem.ManifestItemId
                    Join LanternEvent on 
                        LanternEvent.LanternManifestId = LanternManifest.LanternManifestId
            
            Where LanternManifest.LanternManifestId = ${manId}
            Group By
                    LanternManifest.LanternManifestId, 
                    LanternManifest.CreatedDateTime,
                    Account.FirstName + ' ' +  Account.LastName ,
                    LanternEvent.LanternManifestId, 
                    LanternEvent.Accuracy,
                    LanternEvent.Longitude,
                    LanternEvent.Speed,
                    LanternEvent.Latitude,
                    LanternEvent.Altitude,
                    LanternEvent.Heading,
                    LanternEvent.BatteryLevel,
                    LanternEvent.MoveType,
                    LanternEvent.PingDateTime,
                    LanternEvent.EventNote
               
        )
        
        Select * From UsersLanternManifest
        Order By 
                UsersLanternManifest.pingDateTime
        `


        let returnVal = {
            Manifest: manifest.recordset,
            Parcels: parcels.recordset,
            Route: route.recordset
        }
        console.log(returnVal)

        return returnVal
    }
    catch (err) {
        console.log(err);
    }
    // }
    // else
    // {
    //     console.log('fuck')
    // }



}


