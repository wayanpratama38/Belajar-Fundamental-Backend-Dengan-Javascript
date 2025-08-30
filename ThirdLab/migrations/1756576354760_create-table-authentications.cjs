/* eslint-disable camelcase */


exports.up = (pgm) => {
    pgm.createTable('authentications',{
        token : {
            type : "TEXT",
            notNUll : true,
        }
    })
};

exports.down = (pgm) => {};
