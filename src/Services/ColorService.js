const sql = require("mssql");

export const GetColors = async (username) => {
  await sql.connect(
    "data source=color-database.cneyddwe6evi.us-east-1.rds.amazonaws.com;initial catalog=ColorDb;user id=colorUser;password=Purple99!;MultipleActiveResultSets=True;"
  );

  const colorInfo = await sql.query`
	Select 
		* 
	From 
		Color
	`;

  let returnVal = {
    colors: colorInfo.recordset,
  };
  return returnVal;
};

export const InsertColor = async (req) => {
  console.log(req)
  let pool = await sql.connect(
    "data source=color-database.cneyddwe6evi.us-east-1.rds.amazonaws.com;initial catalog=ColorDb;user id=colorUser;password=Purple99!;MultipleActiveResultSets=True;"
  );
  const dbrequest = pool
    .request()
    .input("hexString", sql.VarChar, req.body.hexString)
    .input("colorName", sql.VarChar, req.body.colorName).query(`
   Insert Into
   Color(hexString, colorName)
   Values(@hexString, @colorName)
            `);
            

  let response = {
    Status: "Success",
  };

  return response;
};
