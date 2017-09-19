
/**********************************************************************************************************/
var fs = require('fs');
var walk = require('walk');
var json2csv = require('json2csv');


/**********************************************************************************************************/
function pcap2csv(path){
	var files = [];
	var counter = 0;
	var i=0;

	// Walker options
	var walker = walk.walk('./'+path, {
	    followLinks: false
	});

	// find all files and add them to an array
	walker.on('file', function (root, stat, next) {
	    files.push(root + '/' + stat.name);
	    next();
	});

	walker.on('end', function () {
	    setInterval(processor,3000);
	});

	function processor(){
		if(files[counter].split('.')[2]=='pcap'){
			var cmd = 'tshark -nr '+files[counter]+ ' -z conv,tcp -q >> ' +path+'/' + counter++ +'.txt'; //tshark has to be already installed on the machine
			var exec = require('child_process').exec;
			exec(cmd, function(error, stdout, stderr) {
				console.log('executed');
			});
		}
	}
}

exports = module.exports = pcap2csv