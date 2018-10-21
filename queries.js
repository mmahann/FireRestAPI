var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
//////var connectionString = 'postgres://postgres:NASASpaceApps2018@104.248.113.234:5432/';
var db = pgp({
  host: "104.248.113.234",
  post: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'NASASpaceApps2018'
});

// add query functions

module.exports = {
  getAllFires: getAllFires,
  getSingleFire: getSingleFire,
  createFire: createFire,
  updateFire: updateFire,
  removeFire: removeFire,
};


// Helper function to check input timestamp for validity
function isValidTimeMark(year, month, day, hour, minute, second) {
  if (year < 1900 || (month < 1 || month > 12) || (day < 1 || day > 31) || (hour < 0 || hour > 23) || (minute < 0 || minute > 59) ||  (second < 0 || second > 59)){
    return false;
  }
  else {
    return true;
  }
}

// Helper function to parse URL friendly timestamps into
// postgres friendly timestamp strings
// acceptable input formats are as follows:
// yyyymmddThhmmssSSS
// yyyymmddThhmmss
// yyyymmddThhmm
// yyyymmddThh
// yyyymmdd
// all other formats will return error.
function parseTimeMark(inputTimeMark){
  var size = inputTimeMark.length;
  var output = "ERROR"; // Set as error for default, override upon successful parse
  if (size >= 15) { // yyyyMMddThhMMss
    var year = inputTimeMark.slice(0, 4);
    var month = inputTimeMark.slice(4, 6);
    var day = inputTimeMark.slice(6, 8);
    var hour = inputTimeMark.slice(9, 11);
    var minute = inputTimeMark.slice(11, 13);
    var second = inputTimeMark.slice(13, 15);
    if(isValidTimeMark(year, month, day, hour, minute, second)){
      output = {
        dateTime: year + '-' + month + '-' + day + " " + hour + ':' +
                            minute + ':' + second,
        truncSize: 'second'
                          };
    }
  } else if (size == 13) { // yyyyMMddThhMM
    var year = inputTimeMark.slice(0, 4);
    var month = inputTimeMark.slice(4, 6);
    var day = inputTimeMark.slice(6, 8);
    var hour = inputTimeMark.slice(9, 11);
    var minute = inputTimeMark.slice(11, 13);
    var second = '00';
    if(isValidTimeMark(year, month, day, hour, minute, second)){
      output = {
        dateTime: year + '-' + month + '-' + day + " " + hour + ':' +
                            minute + ':' + second,
        truncSize: 'minute'
                          };
    }
  } else if (size == 11) { // yyyyMMddThh
    var year = inputTimeMark.slice(0, 4);
    var month = inputTimeMark.slice(4, 6);
    var day = inputTimeMark.slice(6, 8);
    var hour = inputTimeMark.slice(9, 11);
    var minute = '00';
    var second = '00';
    if(isValidTimeMark(year, month, day, hour, minute, second)){
      output = {
        dateTime: year + '-' + month + '-' + day + " " + hour + ':' +
                            minute + ':' + second,
        truncSize: 'hour'
                          };
    }
  } else if (size == 8) { //  yyyyMMdd
    var year = inputTimeMark.slice(0, 4);
    var month = inputTimeMark.slice(4, 6);
    var day = inputTimeMark.slice(6, 8);
    var hour = '00';
    var minute = '00';
    var second = '00';
    if(isValidTimeMark(year, month, day, hour, minute, second)){
      output = {
        dateTime: year + '-' + month + '-' + day + " " + hour + ':' +
                            minute + ':' + second,
        truncSize: 'day'
                          };
    }
  }
  return output;
}

function getAllFires(req, res, next){
  db.any('SELECT * FROM public.fire')
  .then(function (data){
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'All fires retrieved'
    });
  })
  .catch(function (err){
    return next(err);
  });
}

function getSingleFire(req, res, next){
  var fireID = parseInt(req.params.id);
  db.one("SELECT * FROM public.fire WHERE fid = $1", fireID)
  .then(function (data){
    res.status(200)
    .json({
      status: "success",
      data: data,
      message: 'One fire retrieved'
    });
  })
  .catch(function (err){
    return next(err);
  })
}

function createFire(req, res, next){
  db.none('INSERT INTO public.fire(reportedtimemark, fire_lat, fire_lon, fire_alt)' + 
          'values(now(), ${lat}, ${lon}, ${alt})', req.body)
  .then(function () {
    res.status(200)
    .json({
      status: 'success',
      message: 'Reported one fire'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function updateFire(req, res, next){
  console.log("Trying to update Fire");
  var fireID = parseInt(req.params.id);
  var parsedExtTime = parseTimeMark(req.body.exttime);
  console.log("parsed the variables, fireID: "+ fireID + 
  " and parsedExtTime: "+ parsedExtTime.dateTime);
  db.none("update public.fire set fire_extinguished = (to_timestamp($1, 'YYYY-MM-DD HH24:MI:SS')) WHERE fid = $2", [parsedExtTime.dateTime, fireID])
  .then(function (){
    console.log("callback initiated");
    res.status(200)
    .json({
      status: 'success',
      message: "Updated fire"
    });
  })
  .catch(function(err) {
    console.log("caught an error");
    return next(err);
  });
}

function removeFire(req, res, next){

}