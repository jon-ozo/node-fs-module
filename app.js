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
// 		console.log(filehandle.createReadStream({ start: 0, end: 10 }));
// 	} catch (err) {
// 		console.log(err.message);
// 	}
// })();

// working with the read() method
// (async () => {
//     try {
//         const fileHandle = await open('test.txt', 'r');
//         const fileSize = await fileHandle.stat();
//         const buff = Buffer.alloc(fileSize.size);
//         const offset = 0;
//         const length = buff.byteLength;
//         const position = 0;

//         const result = await fileHandle.read(buff, offset, length, position);
//         console.log(result.buffer.toString('utf8'));
//         fileHandle.close();
//     } catch(err) {
//         console.log(err.message);
//     }
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

// (async () => {
//     try {
//         const fileHandle = await open('test.txt');
//         const stream = fileHandle.createReadStream();
//         const result = stream.read(8);
//         console.log(result);
//         result.close();
//     } catch(err) {
//         console.log(err.message);
//     }
// })();

(async () => {
	const CREATE_FILE = 'create file';
	const DELETE_FILE = 'delete file';
	const ADD_TO_FILE = 'add to file';
	const RENAME_FILE = 'rename file';

	const createFile = async (path) => {
		try {
			const wFile = await open(path, 'wx');
			await wFile.close();

			console.log(`File created`);
		} catch (err) {
			if (err.code === 'EEXIST') return console.log(`File already exists`);

			console.log(`Could not create file`);
		}
	};

	const deleteFile = async (path) => {
		try {
			await unlink(path);
			console.log(`File deleted!`);
		} catch (err) {
			console.log(`File does not exist`);
		}
	};

	const addTofile = async (path, content) => {
		try {
			const addContent = await open(path, 'a');
			addContent.appendFile(content);
			addContent.close();

			console.log(`File ${path} successfully updated`);
		} catch (err) {
			console.log(`File ${path} does not exist`);
		}
	};

	const renameFile = async (oldPath, newPath) => {
		try {
			await rename(oldPath, newPath);

			console.log(`Successfully renamed file`);
		} catch (err) {
			if (err.code === 'ENOENT')
				return console.log('No such file or directory');

			console.log('Could not rename file');
		}
	};

	const watcher = watch(join(__dirname, 'command.txt'));
	const openFileHandler = await open(join(__dirname, 'command.txt'), 'r');

	openFileHandler.on('change', async () => {
		const size = (await openFileHandler.stat()).size;
		const buff = allocUnsafe(size);
		const offset = 0;
		const position = 0;

		await openFileHandler.read(buff, offset, size, position);

		const command = buff.toString('utf-8');
		if (command.includes(CREATE_FILE)) {
			const filePath = command.substring(CREATE_FILE.length + 1);
			createFile(filePath);
		}

		if (command.includes(DELETE_FILE)) {
			const deleteFilePath = command.substring(DELETE_FILE.length + 1);
			deleteFile(deleteFilePath);
		}

		if (command.includes(ADD_TO_FILE)) {
			const length = ADD_TO_FILE.length + 1;
			const addPath = command.substring(length, length + 8);
			const addContent = command.substring(length + 9);

			addTofile(addPath, addContent);
		}

		if (command.includes(RENAME_FILE)) {
			const length = RENAME_FILE.length + 1;
			const oldPath = command.substring(length, length + 8);
			const newPath = command.substring(length + 9);

			renameFile(oldPath, newPath);
		}
	});

	for await (const event of watcher) {
		// console.log(event);
		if (event.eventType === 'change') {
			openFileHandler.emit('change');
		}
	}
})();

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
