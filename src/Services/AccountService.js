import MongoClient from "mongodb";
const sql = require('mssql')

export const GetAccounts = async (req) => {
    let returnVal = null;
    return MongoClient.connect(process.env.DB_CONNECTION)
        .then(async (db, err) => {
            if (err) throw err;
            var dbo = db.db("gateslayer");
            let result = await dbo.collection("users").find({}).toArray();
            returnVal = {
                Status: 'Success',
                Data: result
            }
            db.close();
            return returnVal


        });
}
export const GetUserData = async (username) => {
    await sql.connect('data source=asisprod.cwoxb7ccwa4v.us-east-1.rds.amazonaws.com,1433;initial catalog=ASISPortal;user id=asisportaluser;password=Azapuki9;MultipleActiveResultSets=True;')
        const userRoles = await sql.query`
            Select 
                RoleName
            From 
                Account 
            Join AccountSiteRole on AccountSiteRole.AccountId = Account.AccountId
            Join SiteRole on SiteRole.RoleId = AccountSiteRole.RoleId
            Where Account.UserName  = ${username}`

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
                SiteRoles: userRoles.recordset, 
                MenuLinks: menuLinks.recordset
            }
            return returnVal

}


