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
  removeFire: removeFire
};

function getAllFires(req, res, next){
  db.any('SELECT * FROM public.fire')
  .then(function (data){
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'All fires retrieved'
    })
  })
}

function getSingleFire(req, res, next){

}

function createFire(req, res, next){

}

function updateFire(req, res, next){

}

function removeFire(req, res, next){

}