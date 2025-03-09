/**
 * watcher app
 * used to watch a file and execute commands
 * passed into the file
 */

const { open, watch, unlink, rename } = require('node:fs/promises');
const { join } = require('node:path');
const { allocUnsafe } = Buffer;

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
