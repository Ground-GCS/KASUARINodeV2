const fs = require('fs');
const csvWrite = require('csv-write-stream');

let csv = {
	options :  { 
		headers: [
			"Peserta id", 
			"Waktu",
			"Ketinggian",
			"Temperature",
			"Kelembaban",
			"Tekanan",
			"Arah Angin",
			"Kecepatan Angin",
			"Lintang",
			"Bujur"
			]
		
	},
	optionsRAW : {
		headers : [
			"header",
			"ketinggian",
			"temperature",
			"kelembaban",
			"tekanan",
			"lintang",
			"bujur",
			"roll",
			"pitch",
			"yaw"
		]
	},
	createCSVWrite(namafile) {
		let obj = csvWrite(csv.options);
	    obj.pipe(fs.createWriteStream(namafile))
		return obj;
	},
	createCSVWriteRAW(namafile) {
		let obj = csvWrite(csv.optionsRAW);
	    obj.pipe(fs.createWriteStream(namafile))
		return obj;
	},
	saveFile : (obj,data) => {
		obj.write(data);
	},
	closeFile : (obj) => {
		obj.end();
	}
}

module.exports = csv;