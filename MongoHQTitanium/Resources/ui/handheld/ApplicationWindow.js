//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var FirstView = require('ui/common/FirstView');
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});
		
	//construct UI
	var firstView = new FirstView();
	self.add(firstView);
	
	var Client = require('mongoHQTi').MHQT;
	
	var client = new Client();
	
	client.document.query({
		colName: 'Tester1',
		query: {
			fields: {name: 1}
		},
		success: function(r){
			Ti.API.info(r);
		},
		error: function(e){
			Ti.API.error(e);
		}
	});
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
