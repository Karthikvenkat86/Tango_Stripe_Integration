var express = require('express');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var path = require('path');
var bodyParser = require('body-parser');
var tango = require('node-tangocard');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/tangocards';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tangocards');

var insertDocument = function(db, callback) {
   db.collection('cards').insertOne( {
      "brands":[
      {
         "description":"Tango Card",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/tango-card-gift-card.png",
         "rewards":[
            {
               "description":"Tango Card E-Custom",
               "sku":"TNGO-E-V-STD",
               "currency_type":"USD",
               "currency_code":"USD",
               "unit_price":-1,
               "available":true,
               "min_price":1,
               "max_price":500000
            }
         ]
      },
      {
         "description":"(RED)",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/red-donation-gift-card.png",
         "rewards":[
            {
               "description":"(RED)",
               "sku":"REDD-D-V-STD",
               "currency_type":"USD",
               "currency_code":"USD",
               "unit_price":-1,
               "available":true,
               "min_price":1,
               "max_price":100000
            }
         ]
      },
      {
         "description":"1-800-flowers",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/1-800-flowers-gift-card.png",
         "rewards":[
            {
               "description":"1-800 Flowers Gift Card $10",
               "sku":"800F-E-1000-STD",
               "currency_type":"USD",
               "unit_price":1000,
               "available":true,
               "denomination":"1000",
               "currency_code":"USD",
               "locale":"en_US"
            },
            {
               "description":"1-800 Flowers Gift Card $25",
               "sku":"800F-E-2500-STD",
               "currency_type":"USD",
               "unit_price":2500,
               "available":true,
               "denomination":"2500",
               "currency_code":"USD",
               "locale":"en_US"
            },
            {
               "description":"1-800 Flowers Gift Card $50",
               "sku":"800F-E-5000-STD",
               "currency_type":"USD",
               "unit_price":5000,
               "available":true,
               "denomination":"5000",
               "currency_code":"USD",
               "locale":"en_US"
            }
         ]
      },
      {
         "description":"Advance Auto Parts",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/advance-auto-parts-gift-card.png",
         "rewards":[
            {
               "description":"Advance Auto Parts eGift Card",
               "sku":"AAPT-E-V-STD",
               "currency_type":"USD",
               "currency_code":"USD",
               "unit_price":-1,
               "available":true,
               "min_price":1500,
               "max_price":50000
            }
         ]
      },
      {
         "description":"Amazon.ca",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/amazon-canada-gift-card.png",
         "rewards":[
            {
               "description":"Amazon.ca Gift Certificate CAD$5",
               "sku":"AMCA-E-500-STD",
               "currency_type":"USD",
               "unit_price":486,
               "available":true,
               "denomination":"500",
               "currency_code":"CAD",
               "locale":"en_CA"
            },
            {
               "description":"Amazon.ca Gift Certificate CAD$10",
               "sku":"AMCA-E-1000-STD",
               "currency_type":"USD",
               "unit_price":971,
               "available":true,
               "denomination":"1000",
               "currency_code":"CAD",
               "locale":"en_CA"
            },
            {
               "description":"Amazon.ca Gift Certificate CAD$15",
               "sku":"AMCA-E-1500-STD",
               "currency_type":"USD",
               "unit_price":1457,
               "available":true,
               "denomination":"1500",
               "currency_code":"CAD",
               "locale":"en_CA"
            },
            {
               "description":"Amazon.ca Gift Certificate CAD$25",
               "sku":"AMCA-E-2500-STD",
               "currency_type":"USD",
               "unit_price":2428,
               "available":true,
               "denomination":"2500",
               "currency_code":"CAD",
               "locale":"en_CA"
            },
            {
               "description":"Amazon.ca Gift Certificate CAD$50",
               "sku":"AMCA-E-5000-STD",
               "currency_type":"USD",
               "unit_price":4856,
               "available":true,
               "denomination":"5000",
               "currency_code":"CAD",
               "locale":"en_CA"
            },
            {
               "description":"Amazon.ca Gift Certificate CAD$100",
               "sku":"AMCA-E-10000-STD",
               "currency_type":"USD",
               "unit_price":9712,
               "available":true,
               "denomination":"10000",
               "currency_code":"CAD",
               "locale":"en_CA"
            }
         ]
      },
      {
         "description":"Amazon.ca*",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/amazon-ca-gift-card-custom.png",
         "rewards":[
            {
               "description":"Amazon.ca Gift Certificate (Custom)",
               "sku":"AMZCA-E-V-STD",
               "currency_type":"USD",
               "currency_code":"CAD",
               "unit_price":-1,
               "available":true,
               "min_price":1,
               "max_price":200000
            }
         ]
      },
      {
         "description":"Amazon.cn",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/amazon-cn-gift-card.png",
         "rewards":[
            {
               "description":"Amazon.cn Gift Card CNY 50",
               "sku":"AMCN-E-5000-STD",
               "currency_type":"USD",
               "unit_price":799,
               "available":true,
               "denomination":"5000",
               "currency_code":"CNY",
               "locale":"zh_CN"
            },
            {
               "description":"Amazon.cn Gift Card CNY 100",
               "sku":"AMCN-E-10000-STD",
               "currency_type":"USD",
               "unit_price":1598,
               "available":true,
               "denomination":"10000",
               "currency_code":"CNY",
               "locale":"zh_CN"
            },
            {
               "description":"Amazon.cn Gift Card CNY 200",
               "sku":"AMCN-E-20000-STD",
               "currency_type":"USD",
               "unit_price":3196,
               "available":true,
               "denomination":"20000",
               "currency_code":"CNY",
               "locale":"zh_CN"
            },
            {
               "description":"Amazon.cn Gift Card CNY 500",
               "sku":"AMCN-E-50000-STD",
               "currency_type":"USD",
               "unit_price":7989,
               "available":true,
               "denomination":"50000",
               "currency_code":"CNY",
               "locale":"zh_CN"
            },
            {
               "description":"Amazon.cn Gift Card CNY 1000",
               "sku":"AMCN-E-100000-STD",
               "currency_type":"USD",
               "unit_price":15978,
               "available":true,
               "denomination":"100000",
               "currency_code":"CNY",
               "locale":"zh_CN"
            }
         ]
      },
      {
         "description":"Amazon.cn (Custom)",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/amazon-cn-gift-card-custom.png",
         "rewards":[
            {
               "description":"Amazon.cn Gift Card (Custom)",
               "sku":"AMZCN-E-V-STD",
               "currency_type":"USD",
               "currency_code":"CNY",
               "unit_price":-1,
               "available":true,
               "min_price":100,
               "max_price":100000
            }
         ]
      },
      {
         "description":"Amazon.co.jp",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/amazon-jp-gift-card.png",
         "rewards":[
            {
               "description":"Amazon.co.jp Gift Certificate JPY 500",
               "sku":"AMJP-E-50000-STD",
               "currency_type":"USD",
               "unit_price":490,
               "available":true,
               "denomination":"50000",
               "currency_code":"JPY",
               "locale":"ja_JP"
            },
            {
               "description":"Amazon.co.jp Gift Certificate JPY 1000",
               "sku":"AMJP-E-100000-STD",
               "currency_type":"USD",
               "unit_price":980,
               "available":true,
               "denomination":"100000",
               "currency_code":"JPY",
               "locale":"ja_JP"
            },
            {
               "description":"Amazon.co.jp Gift Certificate JPY 2500",
               "sku":"AMJP-E-250000-STD",
               "currency_type":"USD",
               "unit_price":2450,
               "available":true,
               "denomination":"250000",
               "currency_code":"JPY",
               "locale":"ja_JP"
            },
            {
               "description":"Amazon.co.jp Gift Certificate JPY 5000",
               "sku":"AMJP-E-500000-STD",
               "currency_type":"USD",
               "unit_price":4899,
               "available":true,
               "denomination":"500000",
               "currency_code":"JPY",
               "locale":"ja_JP"
            },
            {
               "description":"Amazon.co.jp Gift Certificate JPY 10000",
               "sku":"AMJP-E-1000000-STD",
               "currency_type":"USD",
               "unit_price":9663,
               "available":true,
               "denomination":"1000000",
               "currency_code":"JPY",
               "locale":"ja_JP"
            }
         ]
      },
      {
         "description":"Amazon.co.jp*",
         "image_url":"https://dwwvg90koz96l.cloudfront.net/graphics/item-images/amazon-co-jp-gift-card-custom.png",
         "rewards":[
            {
               "description":"Amazon.co.jp Gift Certificate (Custom)",
               "sku":"AMZJP-E-V-STD",
               "currency_type":"USD",
               "currency_code":"JPY",
               "unit_price":-1,
               "available":true,
               "min_price":1,
               "max_price":500000
            }
         ]
      }]
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback(result);
  });
};

var choosenDocument = function(db, callback) {
   db.collection('choosencards').insertOne( {"reward":[]}, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the Chosen collection.");
    callback(result);
  });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  insertDocument(db, function() {
  	choosenDocument(db, function() {
      db.close();
  	});
  });

});