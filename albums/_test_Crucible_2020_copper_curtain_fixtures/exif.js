const fs = require('fs');
const path = require('path');
const fsPromise = require('fs').promises;
const exifParser = require('exif-parser');

let image, parser, result, thumbnail, filehandle, promise, filesarray; 

/*
promise = new Promise( (resolve, reject)=>{
	//fs.readFile('IMG_0687.jpg', (err, data) =>{
	fs.readFile('starfish.jpg', (err, data) =>{
		if(err) reject(err);
		image = data;
		console.log(image instanceof Buffer);
		resolve(data);
	});
});
	*/

let dir = './';
fsPromise.readdir(dir)
	.then( (files)=>{
		console.log(`${dir} contains files:`);
		for(const file of files) {
			//console.log(path.extname(file));
			if(/(\.jpeg|\.jpg)/.test(path.extname(file)) ) {
				console.log(file);
			}
		}
	})
	.catch( (err)=>{
		console.error(`there are no files: ${err}`);
	});

let starfish_image1 = 'starfish-no-xmp.jpg';
let starfish_image2 = 'starfish-no-xmp-web-export.jpg';
filehandle = fsPromise.readFile(starfish_image2);
if (filehandle instanceof Promise) console.log('starfish is a promise');
console.log(`typeof filehandle is ${typeof filehandle}`);
filehandle
	.then( (data)=>{
		console.log('inside the starfish promise.');
		parser = exifParser.create(data);
		parser.enableReturnTags(true);
		parser.enableTagNames(true);
		parser.enablePointers(true);
		result = parser.parse();
		return result;
	})
	.then( (result)=>{
		// Tagname		TagID		writable	group
		// XPTitle		0x9c9b	int8u			IFD0, 
		// XPComment	0x9c9c	int8u IFD0, 
		// XPAuthor		0x9c9d	int8u IFD0, 
		// XPKeywords	0x9c9e	int8u IFD0, 
		// XPSubject	0x9c9f	int8u IFD0
		console.log(`fsPromise parsed exif data`);
		console.log(result);
		//console.log(result.tags[8].value);
		//console.log(result.tags[10].value);
		//console.log(result.tags[12].value);
		console.log(`thumbnails? ${result.hasThumbnail()}`);
		let thumbsy = result.getThumbnailBuffer();
		let thumbname = 'starfish_all_thumbs.jpg';
		fsPromise.writeFile(thumbname, thumbsy)
			.then( (huh)=>{
				console.log(`huh: ${huh}`);
				console.log(`that guys got 5 thumbs ${thumbname}`);
			})
			.catch( (err)=>{
				console.error("no thumbs here.");
			})
	})
	.catch( (err)=>{
		console.error(err);
	});

/*
promise
	.then( (buffer)=> {
		console.log(buffer);
		parser = exifParser.create(buffer);
		parser.enableReturnTags(true);	
		parser.enableTagNames(true);
		parser.enableBinaryFields(true);
		parser.enablePointers(true);
		result = parser.parse();
		return result;
	})
	.then( (result)=> {
		if(result.hasThumbnail('image/jpeg')) {
			console.log("thumbnail is present in exif data.");
			thumbnail = result.getThumbnailBuffer();
			console.log(thumbnail);
			//process.exit(0);
		} else {
			console.error('no thumbnail present.');
			console.log(result);
			//process.exit(1);
		}
	})
	.catch( (err)=> {
		console.error(err);
	});
	*/
