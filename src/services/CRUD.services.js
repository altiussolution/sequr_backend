var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')
const DBSOURCE = "SQLiteFile.db"

function createService(val){
    let db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
          // Cannot open database
          console.error(err.message)
          throw err
        }else{
            var txt = `create table if not exists users (`;   // Only create if it doesn't exist
                    txt += " id integer primary key not null,";     // The primary key, this value is auto incremented by teh database engine for each new entry
                    txt += " familyName text not null,";            // (Required) The family name of the user
                    txt += " givenName text not null,";             // (Required) The given name(s) of the user
                    txt += " employeeNo text,";                     // (Optional) The employee number of the user
                    txt += " username text not null,";              // (Required) The name the user will enter when trying to log in.
                    txt += " password text not null,";              // (Required) The password the user will enter when trying to log in
                    txt += " phone1num text,";                      // (Optional) Three fields for phone number and phone description for the user
                    txt += " phone1desc text,";
                    txt += " phone2num text,";
                    txt += " phone2desc text,";
                    txt += " phone3num text,";
                    txt += " phone3desc text,";
                    txt += " photoPath text,";                      // (Optional) The file path for a photo of the user
                    txt += " email text,";                          // (Optional) The users email address
                    txt += " loginID1 text,";                       // (Optional) 2 ID fields for use with login devices, e.g. key-fob readers and swipe card readers
                    txt += " loginID2 text,";
                    txt += " permissions integer not null,";        // (Required) The set of permissions that define what the user is permitted to access.
                    txt += " group1 integer not null,";             // (Required) The three group mask definitions
                    txt += " group2 integer not null,";             // (Required)
                    txt += " group3 integer not null";              // (Required)
                    txt += `);`
            db.run(txt,
            (err) => {
                if (err) {
                    // Table already created
                    console.log('error check')
                }else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO users (familyName, givenName, username, password, permissions, group1, group2, group3) VALUES (?,?,?,?,?,?,?,?)'
                    db.run(insert, ["Meena","Meena","Meena",md5("SM12th*"),824129776,8,1,1073741823])
                }
            });  
        }
    });
}

function getService(){
    return 'Get response'
}

module.exports = {
    createService,
    getService
}