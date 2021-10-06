var parseString = require('xml2js').parseString;
const request = require('request')

exports.machineAccess = (async (req,res) =>{
    var body = req.body;
    var url = `http://localhost:44400/machine/singledevinfo.xml?id=${body[x].cube_id}`
    var machineDetails = async (url) => {
      var xml;
      var resultData;
      await new Promise((resolve, reject) => {
          request(url, { json: true }, (err, res, body) => {
            if (err) reject(err)
            resolve(body)
            xml= body 
          });
      })
      
      await parseString(xml, function (err, result) {
        resultData = result;
          
      });

      return resultData
      
    }
    var details = await machineDetails(url) 
    console.log(details);
    // for(let params of body){
    //   var url = `http://localhost:44400/machine/unlock.xml?id=${body[x].cube_id}&drawer=${body[x].bin_name}&compartment=${body[x].compartment_name}`
    //   var details = await machineDetails(url)
    //   if(details.Error){
    //     sendResponse = true;
    //     message = details.Error.message;
    //     details
    //     break;
    //   }else{
    //     console.log('not there')
    //     sendResponse = false;
    //     x++
    //   }
      
    // }
    // if(sendResponse){
    //   res.send({details : message, machine : body[x]})
    // }
    
}) 

