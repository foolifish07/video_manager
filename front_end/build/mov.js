var fs = require('fs');
var path = require('path');

var file1 = 'main.js';
var file2 = 'index.html';

var mv = function(fileName){
	var sourceFile = path.join(__dirname, '..', 'dist', fileName);
	var destPath = path.join(__dirname, '..', '..', 'video_manager', 'public', 'pages', fileName);

	var readStream = fs.createReadStream(sourceFile);
	var writeStream = fs.createWriteStream(destPath);
	readStream.pipe(writeStream);
	console.log(fileName + 'mov success!');
}
mv(file1);
mv(file2);
