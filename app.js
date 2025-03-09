const {
	watch,
	open,
	readFile,
	writeFile,
	appendFile,
	copyFile,
	constants,
	unlink,
	rename,
	createReadStream,
} = require('node:fs/promises');
const { join } = require('node:path');
const { allocUnsafe } = Buffer;
// const http = require('node:http');

// (async (path) => {
//     try {
//         await unlink(path);
//         console.log(`Successfully deleted ${path}`);
//     } catch(err) {
//         console.log(err.message);
//     }
// })('./test.txt');

// working with the readStream() method
// (async () => {
// 	let filehandle;
// 	try {
// 		filehandle = await open('test.txt');
// 		const readFileHandle = filehandle.createReadStream();
// 		readFileHandle.on('data', (chunk) => {
// 			console.log(chunk);
// 		});
// 		console.log('count ---', filehandle.createReadStream());
// 	} catch (err) {
// 		console.log(err.message);
// 	}
// })();

// working with the read() method
// (async () => {
// 	try {
// 		const fileHandle = await open('test.txt', 'r');
// 		const fileSize = await fileHandle.stat();
// 		const buff = Buffer.alloc(fileSize.size);
// 		const offset = 0;
// 		const length = buff.byteLength;
// 		const position = 0;

// 		const result = await fileHandle.read(buff, offset, length, position);
// 		console.log(result.buffer.toString('utf8'));
// 		fileHandle.close();
// 	} catch (err) {
// 		console.log(err.message);
// 	}
// })();

// working with readLines() method
// (async () => {
//     const fileHandle = await open('test.txt');
//     // console.log(fileHandle.readLines());

//     for await(const line of fileHandle.readLines()) {
//         console.log(line);
//         fileHandle.close();
//     }
// })();

// this code prints null cos the code is trying to read data
// data that isn't in the internal buffer yet
// (async () => {
// 	try {
// 		const fileHandle = await open('test.txt');
// 		const stream = fileHandle.createReadStream();
// 		const result = stream.read(8);
// 		console.log(result);
// 		result.close();
// 	} catch (err) {
// 		console.log(err.message);
// 	}
// })();

// Callback API

// fs.open() method opens a file for reading, writing and more;
// open(path.join(__dirname, 'notes.txt'), 'w', (err, fd) => {
// 	if (err) throw err;

// 	// fs.access(fd, fs.constants.R_OK, (err) =>
// 	// 	err ? 'File is readable' : 'File is not readable'
// 	// );	// file descriptor can not be used for accessibility/permissions purposes

// 	read(fd, '\r Try adding another new content', { flag: 'a' }, (err) => {
// 		if (err) throw err;
// 	});
// });

// access() method is used to check the state of a file - if the file is available, readable, writeable or both. it is recommended to not use this method if the file will be used for other operations like writing into the file using the append() method. should the file be put to use, it is recommended to allow the method that is to called on the file to check the availability of the file, throw errors if any and close the file when done.

// check to see if the file is available
// fs.access(path.join(__dirname, 'notes.txt'), fs.constants.F_OK, (err) => {
// 	if (err) return console.log(err.message);

// 	console.log('File is readable');
// });

// appendFile() method is used to add contents to a file. but should the file not exist, the file will be created. this makes a file writeable and as such, if more content needs to be added to the file, the previous cntent will be over-written. to avoid this, nodejs provides some flags that can be added into the options argument.
// const str =
// 	'Let it be known that a file is just data(alphabets, numbers and characters passed into memory, grouped together and stored in a particular location in the computer). The understanding of this aids in the understanding of server side programming especially working with nodejs - buffers and fs.';

// const newStr =
// 	'\r' + 'Newly added message into the file.txt in the files folder';

// works but not a good practice though
// fs.access(
// 	path.join(__dirname, 'files/newFile.txt'),
// 	fs.constants.F_OK,
// 	(err) => {
// 		if (err) {
// 			fs.appendFile(
// 				path.join(__dirname, 'files', 'file.txt'),
// 				newStr,
// 				{ flag: 'a' },
// 				(err) => {
// 					if (err) return err.message;

// 					console.log('Done');
// 				}
// 			);

// 			console.log('New file was created');
// 		} else {
// 			console.log('File already exists');
// 		}
// 	}
// );

// // better practice
// fs.appendFile(
// 	path.join(__dirname, 'files', 'file.txt'),
// 	newStr,
// 	{ flag: 'a' },
// 	(err) => {
// 		if (err) return err.message;

// 		console.log('Done');
// 	}
// );

// fs.chmod() the chmode means change mode also known as change state. it is used to change the mode/state of a file.
// fs.chmod(path.join(__dirname, 'files', 'file.txt'), 0o4, (err) => {
// 	console.log(
// 		`${err ? 'Could not change the file mode' : 'File mode changed'}`
// 	);
// });

// copyFile() method is used to create a file from another file and store it in another location.
// fs.copyFile(
// 	path.join(__dirname, 'test.txt'),
// 	path.join(__dirname, 'newFile.txt'),
// 	(err) => {
// 		if (err) return console.log(err);
// 	}
// );

// fs.createReadStream() method creates a stream for reading files in chunks. this is a faster way to deal with data in nodejs as it doesn't add all the content of the file into the memory causing it to slow down and process data slowly.
// createReadStream(path.join(__dirname, 'files', 'file.txt'), {
// 	start: 10,
// 	end: 20,
// 	encoding: 'utf8',
// }).on('data', (chunk) => {
// 	console.log(chunk);
// });

// fs.read

// console.log(file.read(20));

// http
// 	.createServer((req, res) => {
// 		if ('/') {
// 			fs.mkdir(
// 				path.join(__dirname, 'new_files'),
// 				(err, path) => {
// 					if (err) throw err;

// 					console.log(`Directory path: ${path}`);
// 				}
// 			);
// 		}
// 	})
// 	.listen(3000, 'localhost', () => console.log('Listening on port 3000'));

// readFile(
// 	path.join(__dirname, 'newFile.txt'),
// 	{ encoding: 'utf8' },
// 	(err, data) => {
// 		if (err) return err.message;

// 		console.log(data);
// 	}
// );

// writeFile(
// 	path.join(__dirname, 'test.txt'),
// 	'Replacing the previous data with this data.',
// 	(err) => {
// 		if (err) return err.message;

// 		console.log('File saved successfully');
// 	}
// );

// appendFile(
// 	path.join(__dirname, 'newFil.txt'),
// 	' Appending more data to this existing file',
// 	(err) => {
// 		if (err) return err.message;

// 		console.log('File updated');
// 	}
// );

// unlink(path.join(__dirname, 'newFil.txt'), (err) => {
// 	if (err) {
// 		console.log('File not found');
// 		return;
// 	}

// 	console.log('File deleted successfully');
// });

// copyFile('test.txt', 'copied-file.txt', constants.COPYFILE_EXCL, (err) => {
// 	if (err && err.code === 'ENOENT') {
// 		return console.log('no such file or directory');
// 	} else if (err && err.code === 'EEXIST') {
// 		return console.log('file already exists');
// 	} else {
// 		console.log('File copied sucessfully');
// 	}
// });
