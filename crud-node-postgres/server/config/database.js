/********************************************************
Database Connection Settings
*********************************************************/

// Como host vamos utilizar o nome do serviço criado no docker-compose.yml
const db_host = "db";

// Password definido no docker-compose.yml
const db_pass = "password";

// Banco de dados criado no pgAdmin
const db_name = "crud-node";


exports.conString = "postgres://postgres:"+db_pass+"@"+db_host+"/"+db_name;



// module.exports = {
//    query: function(text, values, cb) {
//       pg.connect(function(err, client, done) {
//         client.query(text, values, function(err, result) {
//           done();
//           cb(err, result);
//         })
//       });
//    }
// }

