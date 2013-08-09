
/**
 * Module dependencies.
 */

//add the express framework 
 var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose=require('mongoose');// mongoose framework needed for acessing and manipulating data on mongoDB

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

//added to access html content 
app.use(express.bodyParser());
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//connnect to database tfiApp created in mongoDB
 mongoose.connect("mongodb://localhost/tfiDB");

//create schema paraSchema which will store paragraphs.Each para has a para number and its content
 var paraSchema=new mongoose.Schema({
 	id:Number,
 	content:String
 	
 });
 
 //create table para using above schema
 para=mongoose.model('para',paraSchema);
 
 countPara=0;
 para.find({},function(err,docs){
				
				para.count(function(err,count){
					countPara=count; //gives number of rows in table para
					console.log("count "+countPara);
				});
	});

//load first page which allows user to enter paragraph 
app.get('/',function(req,res){
	var msg="<h2>Enter paragraph</h2><form method='post' action='send'>Content<br/><textarea name='content'></textarea><br/><input type='submit'/></form>";
	
	res.send(msg);
});

//on clicking submit the paragraph is persisted to database in table para using save method of mongoose.js
app.post('/send',function(req,res){
	
	new para({
		id:countPara,
		content:req.body.content
	}).save(function(err,docs){
		
		if(err)//callback method after saving chk if error in persisting data inform user
		res.send(err);
		else
		{
			//if data persisted then go to searchpg also show user the paragraph stored
			          countPara++;
			        para.find({},function(err,docs){
			        	console.log(countPara+"paras");
			        	var data=docs[countPara-1].content;
			        	res.render("searchpg.jade",{paraMsg:data});
			        });
					
		}
				
				
		});
			
	});

//set up http server using express
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
