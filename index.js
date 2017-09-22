
/**********************************************************************************************************/
var fs = require('fs');
var walk = require('walk');
var json2csv = require('json2csv');


/**********************************************************************************************************/
var files = [];
var counter = 0;
var i=0;
var mytimer;
var dataArray = [{}];
var fields=['A', 'B', 'AtoB (bit/s)','BtoA (bit/s)'];
console.log("please wait, this may take a few minutes...")
function pcap2csv(path, tcp_udp){

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

	function processor(cb){	
		if(files[i]){
			if(files[i].split('.')[1]=='pcap'){
				var separates = files[i].split('/');
				var spawn = require('child_process').spawn, ts = spawn('tshark', ['-nr', files[i], '-z', 'conv,'+tcp_udp, '-q']);

				ts.stdout.on('data', function (data) {

					/**uncomment to write the output of .pcap files to individual .txt files instead**/

				    // fs.writeFile(path+'/'+separates[separates.length-1].split('.')[0] +'.txt', data, function (err) {
				    // 	console.log(path+'/'+separates[separates.length-1].split('.')[0] +'.txt');
				    //     if (err) throw err;
				    // });

				    var array = data.toString().split("|");
				    var line = array[array.length-1];
		    		var linearray = line.match(/\S+/g) || [];
		    		while (linearray.length>11){
			    		var AtoB = parseFloat(linearray[6]) * 8 / parseFloat(linearray[10]);
			    		var BtoA = parseFloat(linearray[4]) * 8 / parseFloat(linearray[10]);
			    		dataArray.push({A:linearray[0], B:linearray[2], 'AtoB (bit/s)':AtoB, 'BtoA (bit/s)':BtoA});
			    		linearray.splice(0, 11)
		    		}
				});

				/**uncomment to enable error and exit code**/
				/*ts.stderr.on('data', function (data) {
				    console.log('stderr: ' + data);
				});
				ts.on('exit', function (code) {
				   console.log('child process exited with code ' + code);
				});*/

				i++;
			}
		}
		else {
			clearInterval(mytimer)
			var csv = json2csv({ data: dataArray, fields: fields, hasCSVColumnTitle:true });
			fs.writeFile(path+'/'+'throughput.csv', csv, function(err) {
			  if (err) throw err;
			  console.log('file saved');
			});
		}
	}
}

/**********************************************************************************************************/
exports = module.exports = pcap2csv