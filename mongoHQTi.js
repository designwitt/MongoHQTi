module.exports.MHQT = function(){
	var mongoHq = 'https://api.mongohq.com';
	var api = 'm7ymj62r0n5rbq9oquoc';
	var db = 'Tester';
	
	Connection = function(){};
	connection = function(){return new Connection();};
	Connection.prototype.get = function(call, options){
		var data, error, success;
		
		success = options['success'] || function(data){return data;};
		
		error = options['error'];
		
		try{
			//make there is a network conneciton
			if(Ti.Network.online === false){
				alert('No network detected. Please make sure a data connection is available.');
				return;
			};
			
			//create the XHR object
			var xhr = Ti.Network.createHTTPClient();
			xhr.setTimeout(40000);
			
			//if error
			xhr.onerror = function(e){
				Ti.API.error("Error calling API: " + xhr.responseText);
				Titanium.API.error("JSON Response: " + JSON.stringify(e));
				error && error(e);
				xhr.abort();
				xhr = null;
			};
			
			//set the success callback
			xhr.onload = function(){
				Titanium.API.info("Success calling API " + xhr.responseText);
				success && success(JSON.parse(xhr.responseText));
			};
			
			//generate our URL
			var url = mongoHq + '/databases/' + db + '/' + call + '?_apikey=' + api;
			
			//if there is data to get create the query parameter
			var queryParam = '';
			if(options['query'] != {}){
				var query = options['query'];
				
				if(query['q']){
					queryParam+= '&q=' + JSON.stringify(query['q']);
				}
				if(query['fields']){
					queryParam+= '&fields=' + JSON.stringify(query['fields']);
				}
				if(query['skip']){
					queryParam+= '&skip=' + query['skip'];
				}
				if(query['limit']){
					queryParam+= '&limit=' + query['limit'];
				}
				if(query['sort']){
					queryParam+= '&sort=' + JSON.stringify(query['sort']);
				}
				
				url+=queryParam;
			};
			
			Ti.API.info(url);
			
			xhr.open('GET', url);
			xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			
			xhr.send();
		}
		catch(error){
			
		}
		
		return success;
	};
	
	//collections
	Collection = function(){};
	Collection.prototype.all = function(options){
		return connection().get('collections', options);
	};
	
	Collection.prototype.statsByName = function(options){
		return connection().get('collections/' + options['colName'], options);
	};
	
	//documents
	Document = function(){};
	Document.prototype.all = function(options){
		return connection().get('collections/' + options['colName'] + '/documents', options);
	};
	
	Document.prototype.query = function(options){
		return connection().get('collections/' + options['colName'] + '/documents', options);
	};
	
	Document.prototype.byId = function(options){
		return connection().get('collections/' + options['colName'] + '/documents/' + options['_id'], options);
	};
	
	return {
		collection: new Collection(),
		document: new Document()
	};
};
