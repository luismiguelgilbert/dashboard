import sql from 'mssql';

const sqlConfig: sql.config = {
  user: process.env.SQL_DATABASE_USR,
  password: process.env.SQL_DATABASE_PWD,
  database: process.env.SQL_DATABASE_NAME,
  server: process.env.SQL_DATABASE_URL!,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

const serverDB = new sql.ConnectionPool(sqlConfig);

const initialize = async () => {
  try {
    if (!serverDB.connected) {
      console.log('Enable SQL Server?');
      // await serverDB.connect();
    }
  } catch (err) {
   console.error('SQL error', err);
  }
};
initialize();

export default serverDB;