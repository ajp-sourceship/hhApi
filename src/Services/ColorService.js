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
    colors: colors.recordset,
  };
  return returnVal;
};

export const InsertColor = async (req) => {
  await sql.connect(
    "data source=color-database.cneyddwe6evi.us-east-1.rds.amazonaws.com;initial catalog=ColorDb;user id=colorUser;password=Purple99!;MultipleActiveResultSets=True;"
  );
  let hexStr = req.body.hexStr;
  const accountList = await sql.query`
   Insert Into
   Color(hexString)
   Values(${hexStr})
            `;
  let returnVal = {
    accounts: accountList.recordset,
  };
  return returnVal;
};
