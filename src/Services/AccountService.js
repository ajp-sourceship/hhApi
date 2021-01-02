import MongoClient from "mongodb";
import globals from "../../globals";
const sql = require('mssql')

export const GetUserData = async (username) => {
    await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')

    const userInfo = await sql.query`
	Select 
		Account.UserName,
		Account.FirstName, 
		Account.LastName, 
		Account.CustomerId, 
		Account.CustomerImpersonationId
	From 
		Account 
	Where Account.UserName  =  ${username}`

    const userRoles = await sql.query`
        Select 
		RoleName
	From 
		Account 
	Join AccountSiteRole on AccountSiteRole.AccountId = Account.AccountId
	Join SiteRole on SiteRole.RoleId = AccountSiteRole.RoleId
    Where Account.UserName  =  ${username}`

    const userPermissions = await sql.query`
        Select distinct
		PermissionCode
	From 
		Account 
	Join AccountSiteRole on AccountSiteRole.AccountId = Account.AccountId
	Join SiteRole on SiteRole.RoleId = AccountSiteRole.RoleId
	Join SiteRolePermission on SiteRole.RoleId = SiteRolePermission.RoleId
	Join SitePermission on SitePermission.PermissionId = SiteRolePermission.PermissionId
	Where Account.UserName  =  ${username}`

    const menuLinks = await sql.query`
            Select distinct
                MenuLink.MenuLinkId, 
                MenuText,
                MenuDescription, 
                SortOrder,
                ParentLinkId
            From 
                Account 
            Join AccountSiteRole on AccountSiteRole.AccountId = Account.AccountId
            Join SiteRoleMenuLink on SiteRoleMenuLink.RoleId = AccountSiteRole.RoleId
            Join MenuLink on MenuLink.MenuLinkId = SiteRoleMenuLink.MenuLinkId
            Where Account.UserName  = ${username}`

    let returnVal = {
        siteRoles: userRoles.recordset,
        menuLinks: menuLinks.recordset,
        userInfo: userInfo.recordset,
        userPermissions: userPermissions.recordset
    }
    return returnVal

}


export const GetAccounts = async (req) => {
    let customerId = req.user.userData.userInfo[0].CustomerImpersonationId;
    await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')

    let usernameFilter = ''
    let emailFilter = ''
    let firstNameFilter = ''
    let lastNameFilter = ''

    if(req.body.username !== undefined)
    {
        usernameFilter = req.body.username
    }

    if(req.body.firstName !== undefined)
    {
        firstNameFilter = req.body.firstName
    }

    if(req.body.lastName !== undefined)
    {
        lastNameFilter = req.body.lastName
    }

    if(req.body.email !== undefined)
    {
        emailFilter = req.body.email
    }

    const accountList = await sql.query`
    Select 
    Account.AccountId,
    Account.FirstName, 
    Account.LastName, 
    Account.LastLoginDate,
    Account.EmailAddress, 
    Account.UserName,
    Account.CustomerId,
    Customer.CustomerName,
    Account.IsDeleted
    From Account

    Join Customer on Customer.CustomerId = Account.CustomerId

    Where 
        Customer.CustomerId = ${customerId}
    And 
    IsDeleted is null
        
        And 
        Account.FirstName like '%%'
        AND
        Account.LastName like '%%'
        AND
        Account.UserName like '%%'
        AND
        Account.EmailAddress like '%%'
            `
    let returnVal = {
        accounts: accountList.recordset
    }
    return returnVal

}

export const GetAccountDetails = async (req) => {
    let customerId = req.user.userData.userInfo[0].CustomerImpersonationId;
    let accountId = req.body.AccountId.AccountId
    await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')

    let usernameFilter = ''
    let emailFilter = ''
    let firstNameFilter = ''
    let lastNameFilter = ''

    if(req.body.username !== undefined)
    {
        usernameFilter = req.body.username
    }

    if(req.body.firstName !== undefined)
    {
        firstNameFilter = req.body.firstName
    }

    if(req.body.lastName !== undefined)
    {
        lastNameFilter = req.body.lastName
    }

    if(req.body.email !== undefined)
    {
        emailFilter = req.body.email
    }

    const accountList = await sql.query`
    Declare @customerId int = ${customerId};
    With customerIds as ( 
        Select 
            Customer.CustomerId,
            Customer.CustomerKey,
            Customer.CustomerName,
            Customer.MarkerColor,
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
        Account.FirstName, 
        Account.LastName, 
        Account.LastLoginDate,
        Account.EmailAddress, 
        Account.ContactNumber,
        Account.UserName,
        Account.CustomerId,
        Account.IsDeleted,
        SiteRole.RoleName
        From Account
    
        join customerIds on Account.CustomerId = customerIds.CrossRefId
        Join AccountSiteRole on AccountSiteRole.AccountId = Account.AccountId
        Join SiteRole on AccountSiteRole.RoleId = SiteRole.RoleId 
    
        Where 
            customerIds.CustomerId = @customerId
        And 
        Account.AccountId = ${accountId}
        AND
        IsDeleted is null
            
            And 
            Account.FirstName like '%%'
            AND
            Account.LastName like '%%'
            AND
            Account.UserName like '%%'
            AND
            Account.EmailAddress like '%%'
            `
    let returnVal = {
        AccountDetails: accountList.recordset
    }
    return returnVal

}


