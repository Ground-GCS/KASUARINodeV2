
/**
 *
 * Bismillahirahmanirahim 
 * Todo : 
 *	1. config serial port
 * 	2. socket.io
 */
 // change this with the home coordinate
let  homeLatitude = -7.658567,
	   homeLongitude = 107.689918;

const kombatData = require('./config/attributesKombat');

/*=======================================================
=            Serial Communication Defenition            =
=======================================================*/
const serial = require('./config/serialConnection.js'),
	  	SerialPort = require('serialport'),
	  	parsers =  SerialPort.parsers;
	  	kombatParser = new parsers.Readline({
				delimiter : '\r\n'
			}),
	  	mainPortNum = process.argv[2], 
	  	antennaPortNum = process.argv[3],
	  	mainBaudRate = 57600;
/*=====  End of Serial Communication Defenition  ======*/

/*======================================================
=            Socket IO & Express Defenition            =
======================================================*/
const express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		path = require('path');

app.use(express.static(path.join(__dirname,'Public'))); // untuk nempation file web kita di folder www
const portListen = 3000;
server.listen(portListen);
console.log("Server starting on localhost:"+portListen)
let jumlahClient = 0;
io.on('connection' , (socket) => {
	jumlahClient++;
	console.log('New Client Connected...\n'  + 'Total :' + jumlahClient);

	socket.on('disconnect' , ()=> {
		jumlahClient--;
		console.log('Client disconnected \n' + 'Total :' + jumlahClient);
	});

});

/*=====  End of Socket IO & Express Defenition  ======*/

try {
	kombatPort = serial.connectSerial(mainPortNum,mainBaudRate);
	//open the port
	kombatPort.on('open', ()=> {
		setTimeout(()=>{
			serial.writeAndDrain(kombatPort,"1");
		},3000);
		console.log("Main serial is open, starting receieve the data...");
	});

	kombatPort.pipe(kombatParser);
	kombatParser.on('data' , (data) => {
	 	let result;
	 	result = serial.parsingRAWData(data,",");
	 	console.log(result);
	 	if(result.length == 10 && result[0] == "OK"){
	 		console.log(result);
	 		//set data
	 		kombatData.setData(result);
	 		
	 	  io.sockets.emit('kirim', { 
            datahasil : [
              kombatData.ketinggian,
              kombatData.temperature,
              kombatData.kelembaban,
              kombatData.tekanan,
              kombatData.arahAngin,
              kombatData.kecAngin,
              kombatData.latitude,
              kombatData.longitude,
              kombatData.pitch,
              kombatData.roll,
              kombatData.yaw            ]
          });  

          io.sockets.emit('dataGraph', {  
            data : [ 
              kombatData.ketinggian,
              kombatData.temperature,
              kombatData.kelembaban,
              kombatData.tekanan,
              kombatData.arahAngin,
              kombatData.kecAngin            ]
          });

          io.sockets.emit('dataGauge', {  
            data : [ 
              kombatData.ketinggian,
              kombatData.temperature,
              kombatData.kelembaban,
              kombatData.tekanan,
              kombatData.arahAngin,
              kombatData.kecAngin
            ]
          });

          io.sockets.emit('dataCoordinate', {  
            data : [ 
              kombatData.latitude,
              kombatData.longitude
            ]
          });

          io.sockets.emit('angin' , {
            data : [ 
              kombatData.arahAngin , 
              kombatData.kecAngin
            ]
          });
	 	}
	});


	// check the string from antennaPort
	if(antennaPortNum != null)
		antennaPort = serial.connectSerial(antennaPortNum,mainBaudRate);



} catch(error) {
	console.error(error);
	console.log("Available Port are : ");
	serial.checkListPort();
}

// Safely close
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
    	kombatPort.close(function (err) {
		    console.log('port closed', err);
		});
    	if(antennaPortNum != null)
    		antennaPort.close();

    	console.log('Close Port..');
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));





