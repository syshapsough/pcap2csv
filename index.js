
/**********************************************************************************************************/
var fs = require('fs');
var walk = require('walk');
var json2csv = require('json2csv');


/**********************************************************************************************************/
var files = [];
var counter = 0;
var i=0;
var mytimer;

function pcap2csv(path){

	// Walker options
	var walker = walk.walk(path, {
	    followLinks: false
	});

	// find all files and add them to an array
	walker.on('file', function (root, stat, next) {
	    files.push(root + '/' + stat.name);
	    next();
	});

	walker.on('end', function () {
	    mytimer = setInterval(processor,1000);
	    //processor()
	   //setTimeout(function(){console.log("done")}, 3000);
	});

	function processor(){
		if(files[i]){
			if(files[i].split('.')[1]=='pcap'){
				var separates = files[i].split('/');
				var spawn = require('child_process').spawn,
					ts = spawn('tshark', ['-nr', files[i], '-z', 'conv,tcp', '-q']);

				ts.stdout.on('data', function (data) {
				    fs.writeFile(path+'/'+separates[separates.length-1].split('.')[0] +'.txt', data, function (err) {
				    	console.log(path+'/'+separates[separates.length-1].split('.')[0] +'.txt');
				        if (err) throw err;
				    });
				});
				/*ts.stderr.on('data', function (data) {
				    console.log('stderr: ' + data);
				});

				ts.on('exit', function (code) {
				   console.log('child process exited with code ' + code);
				});*/
				i++;
			}
		}
		else clearInterval(mytimer)
	}
}

/**********************************************************************************************************/
exports = module.exports = pcap2csv