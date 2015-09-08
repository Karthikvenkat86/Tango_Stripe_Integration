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
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tangocards');


var TangoCards = mongoose.model('cards', { brands: Array });
var TangoChoosenCards = mongoose.model('choosencards', { reward: Array });

/*************************/
// Constants
var stripe = require("stripe")("sk_test_0puCjmg6uw8bwtqoFYBD5q8Q");

var tangoClient = new tango({
  name: 'TangoTest',
  key: '5xItr3dMDlEWAa9S4s7vYh7kQ01d5SFePPUoZZiK/vMfbo3A5BvJLAmD4tI=',
  domain: 'https://sandbox.tangocard.com'
});


var app = express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',function (request,response) {
  
    response.render('home');
});


/*stripe.accounts.create(
  {
    country: "US",
    managed: true
  }, function(err, charge) {
  	console.log("accounts_Create-> ", charge);
  	console.log("accounts_Create-> ", err);
  }
);*/


/*** CREATE NEW CUSTOMER ****/
/*stripe.customers.create({
  description: 'Customer for test@example.com',
  source: "tok_16gsJZFPN932l2gmhnfiLn6T" // obtained with Stripe.js
}, function(err, customer) {
   console.log("customers1-> ", customer);
  	console.log("customers1_err-> ", err);
});

RESPONSE:
customers->  { object: 'list',
  has_more: false,
  url: '/v1/customers',
  data: 
   [ { object: 'customer',
       created: 1441611160,
       id: 'cus_6wCWHB2EY1A7oA',
       livemode: false,
       description: 'Customer for test@example.com',
       email: null,
       shipping: null,
       delinquent: false,
       metadata: {},
       subscriptions: [Object],
       discount: null,
       account_balance: 0,
       currency: null,
       sources: [Object],
       default_source: 'card_16gsJZFPN932l2gm4SpYh61Y' } ] }

*/




/*** LIST OF CUSTOMER ****/
/*stripe.customers.list(
  { limit: 3 },
  function(err, customers) {
   console.log("customers-> ", customers);
  	console.log("customers_err-> ", err);
  }
);*/



/*** CREATE NEW CREDIT CARD FOR CUSTOMER ****/
/*stripe.customers.createSource(
  "cus_6wCWHB2EY1A7oA",  
  {source: "tok_16iKFjFPN932l2gmwHSg8MEj"},
  function(err, card) {
    console.log("card_1-> ", card);
  	console.log("card_1_err-> ", err);
  }
);
RESPONSE:
card_1->  { id: 'card_16iKFjFPN932l2gmXjndml3j',
  object: 'card',
  last4: '4242',
  brand: 'Visa',
  funding: 'credit',
  exp_month: 8,
  exp_year: 2016,
  fingerprint: 'ZR726tXH4mM9y0ui',
  country: 'US',
  name: null,
  address_line1: null,
  address_line2: null,
  address_city: null,
  address_state: null,
  address_zip: null,
  address_country: null,
  cvc_check: null,
  address_line1_check: null,
  address_zip_check: null,
  tokenization_method: null,
  dynamic_last4: null,
  metadata: {},
  customer: 'cus_6wCWHB2EY1A7oA' }*/


/*** UPDATE A CREDIT CARD FOR CUSTOMER ****/
/*stripe.customers.updateCard(
  "cus_6wCWHB2EY1A7oA",
  "card_16iKFjFPN932l2gmXjndml3j",
  { 
	exp_month: "12",
	exp_year: "2017",
	name:"karthikcard",
	address_line1:"1",
	address_city:"chennai",
	address_zip: "64040",
	address_state: "IL",
	address_country: "US"},
  function(err, card) {
    console.log("card_2-> ", card);
  	console.log("card_2_err-> ", err);
  }
);

RESPONSE:
card_2->  { id: 'card_16iKFjFPN932l2gmXjndml3j',
  object: 'card',
  last4: '4242',
  brand: 'Visa',
  funding: 'credit',
  exp_month: 12,
  exp_year: 2017,
  fingerprint: 'ZR726tXH4mM9y0ui',
  country: 'US',
  name: 'karthikcard',
  address_line1: '1',
  address_line2: null,
  address_city: 'chennai',
  address_state: 'IL',
  address_zip: '64040',
  address_country: 'US',
  cvc_check: null,
  address_line1_check: 'pass',
  address_zip_check: 'pass',
  tokenization_method: null,
  dynamic_last4: null,
  metadata: {},
  customer: 'cus_6wCWHB2EY1A7oA' }*/





app.post('/paycc',function (request,response) {

	var stripeToken = request.body.stripeToken;
	console.log(request.body.amount)

	/*** CREATE NEW CUSTOMER WITH CREATED TOKEN AGAINST CARD****/
	stripe.customers.create({
	  description: request.body.cardholdername,
	  source: stripeToken // obtained with Stripe.js
	}, function(err, customer) {
	   console.log("created_customers1-> ", customer);
	   console.log("created_customers1_err-> ", err);
     console.log("customerId", customer.id);
     customerId = customer.id;
	   TangoCards.findOne({"brands":{$exists:true}}, '', function (err, cards) {
		  if (err) return handleError(err);
		  console.log(cards) // Space Ghost is a talk show host.
		  response.render('choose_gift', {response: cards});
	   });
	   
	});


	/*** CHARGE CREDIT CARD FOR CUSTOMER ****/
	/*var charge = stripe.charges.create({
	  amount:  request.body.amount, // amount in cents, again
	  currency: "usd",
	  source: request.body.stripeToken,
	  description: "Example charge"
	}, function(err, charge) {
		console.log("err-->", err);
		console.log("charge---->", charge);
	  if (err && err.type === 'StripeCardError') {
	    console.log(err);
	  } else {
	  	tangoClient.getRewards(function(err, rewards) {
  			response.render('response', {response: rewards});
  		});	  	
	  }
	});*/
});


app.post('/saveChoosen',function (request,response) {
	var rewards = request.body.reward;
	//We need to get SKU id and image and desciption to show in user page.
	console.log(request.body);
	var rewardObj = new TangoChoosenCards(rewards);
	rewardObj.reward = rewards;
	rewardObj.save(function (err, candies) {
		response.redirect(302, '/sendGift');
	});	
});

app.get('/sendGift',function (request,response) {
	response.render('sendGift');
});

app.post('/sendMail',function (request,response) {

	var mail = request.body.customer_email;
	//Mailer is not used here for DEMO
	response.redirect(302, '/redeemCoupon/?mail='+mail+'&cusId='+customerId );
});

app.post('/redeemTango',function (request,response) {
	var mail = request.body.reward;
	//Will be expecting a SKU id of each card.
	
	/*** CHARGE CREDIT CARD FOR CUSTOMER ****/
	var charge = stripe.charges.create({
	  amount:  1000, // amount in cents, again
	  currency: "usd",
	  customer: request.body.custId,
	  description: "Example charge"
	}, function(err, charge) {
		console.log("err-->", err);
		console.log("charge---->", charge);
	  if (err && err.type === 'StripeCardError') {
	    console.log(err);
	  } else {
      //var customer = "customer"+(Math.random(100000)*( 100000 * 10000  * 100000000 ));
      //var cust_identifier = "customer_identify"+(Math.random(100000)*( 100000 * 10000  * 100000000 ));
/*      var email = request.body.mail;
      var campaign = "kc gift";
      var recipient_name = request.body.mail;
      var recipient_email = request.body.mail;
      var skuId = "TNGO-E-V-STD"; // Need to pick it up from reward dynamically based on selection.
      var amount = "1000"; // Hard coded but need to get it from business selection.
      var reward_from = "Business Person" ;
      var reward_subject =  "Gift Card by ";
      var reward_message =  "Gift card by  by business person to customer";*/


      var payload ={
        "customer": "TangoCards",
        "account_identifier": "tcards",
        "campaign": "sample gift",
        "recipient": {
          "name": recipient_email,
          "email":recipient_email
        },
        "sku": "TNGO-E-V-STD",
        "amount": 1000,
        "reward_from": "Business Person",
        "reward_subject": "Gift Card by sample",
        "reward_message": "Gift card by sample by business person to customer",
        "send_reward": true
      }
 

      //var accoutDetails = {"customer":customer,"identifier":cust_identifier,"email":email};
      //var payload = {"customer": customer,"account_identifier": cust_identifier,"campaign": campaign,"recipient": {"name": recipient_name,"email": recipient_email},"sku": skuId,"amount": amount,"reward_from": reward_from,"reward_subject": reward_subject,"reward_message": reward_message,"send_reward": true};
      //console.log("accoutDetails--->", accoutDetails);
      console.log("payload--->",payload);
      //tangoClient.createAccount(accoutDetails ,function(err, accountResp) {
/*          console.log("response createAccount---" , response);
          console.log("err createAccount---" , err);*/    
          tangoClient.placeOrder(payload, function(err, res) {
            console.log("response placeOrder---" , res);
            console.log("err placeOrder---" , err);
            if (err) {
              response.render('successpage', {response: err});
            } else {
              response.render('successpage', {response: res});
            }
            //response.render('succssPage', {response: response});
          });      
       // }); 
	  }
	});

  

});

app.get('/redeemCoupon',function (request,response) {
  var mail = request.query.mail;
  var custId = request.query.cusId;
	TangoChoosenCards.findOne({"reward": {$exists: true, $not: {$size: 0}} } , '', function (err, cards) {
		  if (err) return handleError(err);
		  console.log(cards) // Space Ghost is a talk show host.
		  response.render('redeem', {response: cards, customerId:custId, email:mail});
	});
});

app.post('/sendCard',function (request,response) {
	var accoutDetails = {"customer":request.body.customer,"identifier":request.body.account_identifier,"email":request.body.s_email}
	var payload = {"customer": request.body.customer,"account_identifier": request.body.account_identifier,"campaign": request.body.campaign,"recipient": {"name": request.body.r_name,"email": request.body.r_email},"sku": request.body.account_identifier,"amount": 999,"reward_from": request.body.s_name,"reward_subject": request.body.reward_subject,"reward_message": request.body.reward_message,"send_reward": true}
	tangoClient.createAccount(accoutDetails ,function(err, response) {
		console.log("response createAccount---" , response);
  		console.log("err createAccount---" , err);		
  		tangoClient.placeOrder(payload, function(err, res) {
  			console.log("response placeOrder---" , res);
  			console.log("err placeOrder---" , err);
  			//response.render('response', {response: response});
  		});	  	 
  	});	
	
});


/*{
  "customer": "test",
  "account_identifier": "test1",
  "campaign": "summa",
  "recipient": {
    "name": "you",
    "email": "youonnly"
  },
  "sku": "TNGO-E-V-STD",
  "amount": 999,
  "reward_from": "me",
  "reward_subject": "meonly",
  "reward_message": "message ithuthan",
  "send_reward": true
}
*/

app.listen('4007',function (req,res,next){
	console.log('Server started on port 4007');
});
