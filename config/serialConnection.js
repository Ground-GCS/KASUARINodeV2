const SerialPort = require('serialport');
// const parsers = SerialPort.parsers;
// const parser = new parsers.Readline({
// 	delimiter : '\r\n'
// });

const mySerial = {
	myPort : null,
	mainPortNumber : "COM8",
	antennaPortNumber : "COM12",
	baudRate : "57600",
	dataReceive : null,
	connectSerial : (portNumber, baudRte) =>{
		// this function is to create serial object from the spesific port number
		myPort = new SerialPort(portNumber, {
			baudRate : baudRte
		});

		//myPort.pipe(parser); // port with parser
		this.myPort = myPort;
		return myPort;
	},
	checkListPort : () => {
		SerialPort.list( (err, ports) => {
			let inc = 0;
		  	ports.forEach( (port) => {
		    	inc++;
		    	console.log(inc +":"+ port.comName + " - " + port.manufacturer);
		  		console.log("Please connect to existing port number");
		  	});
		});
	},
	writeAndDrain : (port,data,callback) => {
		//Write the `data` and wait until it has finished transmitting to the target serial port before calling the callback. This will queue until the port is open and writes are finished.
		port.write(data);
		port.drain(callback);
		console.log("Write data..");
	},
	parsingRAWData : (data,delimiter) => {
		//split the data into array
		let result = [];
		if(data != undefined)
			result = data.toString().replace(/(\r\n|\n|\r)/gm,"").split(delimiter);

		return result;
	},
	getDataReceive : () => {
		return this.dataReceive;
	}
};


module.exports = mySerial; //export the object for using another file.