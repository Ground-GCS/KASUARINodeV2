
/**
 *
 * Bismillahirahmanirahim 
 * Todo : 
 *	1. Config serial port (done)
 * 	2. socket.io (done)
 *  3. All Parameter sesuai (done)
 *  4. Antenna Tracker sudut azimuth dan elevasi (done)
 *  4. Save 10 detik csv (done)
 *  5. try vincenty formula using node-vincenty
 */
 // change this with the home coordinate
 //-6.970484, 107.629704
 //-6.975553, 107.630305
let  homeLatitude = -6.976938,
	   homeLongitude = 107.630218;

const kombatData = require('./config/attributesKombat'); // config data
const moment = require('moment-timezone'); //config timezone
moment().tz("Asia/Bangkok").format();

/*=======================================================
=            Serial Communication Defenition            =
=======================================================*/
const serial = require('./config/serialConnection.js'),
	  	SerialPort = require('serialport'),
	  	parsers =  SerialPort.parsers;
	  	kombatParser = new parsers.Readline({
				delimiter : '\r\n'
			}),
      ATParser = new parsers.Readline({
        delimiter : '\r\n'
      }), 
	  	mainPortNum = process.argv[2], // first argument for KOMBAT serial connection
	  	antennaPortNum = process.argv[3], // second argument for Antenna Tracker serial connection
	  	mainBaudRate = 57600;
/*=====  End of Serial Communication Defenition  ======*/

/*======================================================
=            Socket IO & Express Defenition            =
======================================================*/
const express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		path = require('path'),
    bodyParser = require('body-parser');

//config express for using json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'www'))); // untuk nempation file web kita di folder www

// route 
app.get('/data' , function(req , res) {
  res.json({data : kombatData.graph}); // send data graph to route /data
});

const portListen = 3000;
server.listen(portListen);
console.log("Server starting on localhost:"+portListen)

let jumlahClient = 0;

// connection event
io.on('connection' , (socket) => {
	jumlahClient++;
	console.log('New Client Connected...\n'  + 'Total :' + jumlahClient);

	socket.on('disconnect' , ()=> {
		jumlahClient--;
		console.log('Client disconnected \n' + 'Total :' + jumlahClient);
	});

  socket.on('savingData' , (data)=>{
    csvWrite.saveFile(writerFilter,kombatData.getArrayData());
    kombatData.dataAdd();
  });

});


/*=====  End of Socket IO & Express Defenition  ======*/
// Setup CSV
const csvWrite = require('./config/csvWrite.js');
let writerRAW;
let writerFilter;
function setupCSVWrite(){
  writerRAW = csvWrite.createCSVWriteRAW('saveRAW('+ moment().format("DD-MM-YYYY_HH-mm-ss)")+'.csv');
  writerFilter = csvWrite.createCSVWrite('saveFilter(' +  moment().format("DD-MM-YYYY_HH-mm-ss)")+'.csv');
}
setupCSVWrite();

// MAIN 
let kombatPort = null;
let antennaPort = null;
let azimuth = 0 , bearing = 0;
try {
	kombatPort = serial.connectSerial(mainPortNum,mainBaudRate); // open serial connection
  antennaPort = serial.connectSerial(antennaPortNum, 115200);

  //setupAntennaTracker(); // make antennaPort available
	//open the port
	antennaPort.on('open', ()=> {
    setTimeout(()=>{
      //serial.writeAndDrain(kombatPort,"1");
    },3000);
    console.log("Antenna serial is open, starting receieve the data...");
  });


  antennaPort.pipe(ATParser);
 

  kombatPort.on('open', ()=> {
		setTimeout(()=>{
			serial.writeAndDrain(kombatPort,"1");
		},3000);
		console.log("Main serial is open, starting receieve the data...");
	});

	kombatPort.pipe(kombatParser); // using parser

  // data event for serial data incoming
	kombatParser.on('data' , (data) => {
    //console.log(data);
	 	let result;
	 	result = serial.parsingRAWData(data,","); // parsing incoming data.

	 	if(result.length == 10 && result[0] == "OK"){
	 		console.log("IN");
	 		//set data to the object 
	 		kombatData.setData(result);

      //calculate bearing and windspeed
      kombatData.getBearing_WindSpeed();
      azimuth = kombatData.getAzimuthAT(homeLatitude,homeLongitude);
      elevation = kombatData.getElevationAT(homeLatitude, homeLongitude);

      // azimuth and elevation
      console.log('Azimuth : ' + azimuth);
      console.log('Elevation : ' + elevation);

      let datts = kombatData.getData();
      console.log(datts);


      // invoke function to send to socket
      sendToSockets();

      // save RAW Data
      csvWrite.saveFile(writerRAW,result);

      // write antenna
      //if (antennaPortNum != null)
  
    }

 ATParser.on('data', (data) =>{
    console.log(data);
  });


	});

} catch(error) {
  // Exception error
	console.error(error);
	console.log("Available Port are : ");
	serial.checkListPort();
}

setInterval(()=>{
console.log("write AT");
    command =  azimuth + "," + elevation + "#";
    console.log(command);
    //serial.writeAndDrain(portAT,command);
    antennaPort.write(command);
},1000);

function setupAntennaTracker(){
  if (antennaPortNum != null){
    antennaPort = serial.connectSerial(antennaPortNum,mainBaudRate);
    console.log("SETUP Antenna Tracker");
    console.log(antennaPortNum);
    antennaPort.pipe(ATParser);

    antennaPort.on('open' , ()=> {

    ATParser.on('data', (data)=>{
      console.log(data);
    });
    });
  }
}

// write azimuth and elevation to antenna tracker
let prevElevation = 0, prevAzimuth = 0 , command = "";
function writeAntennaTracker(azimuth, elevation, portAT){
 // if (prevElevation != elevation || prevAzimuth != azimuth){
    prevElevation = elevation;
    prevAzimuth = azimuth;
    console.log("write AT");
    command = " " + azimuth + "," + elevation + "#";
    //serial.writeAndDrain(portAT,command);
    antennaPort.write(command);
  //}
}

// function readAT(parser){
//   parser.on("data" =>(data) {
//     console.log(data);
//   });
// }


// io.socket.emit send to web socket
// call it to main..
function sendToSockets(){
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
      kombatData.yaw
      ]
  });  

  io.sockets.emit('dataGraph', {  
    data : [ 
      kombatData.ketinggian,
      kombatData.temperature,
      kombatData.kelembaban,
      kombatData.tekanan,
      kombatData.arahAngin,
      kombatData.kecAngin            
      ]
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

}; 



// save to CSV and log to attitude
setInterval(()=>{
  console.log("save data to csv");
  csvWrite.saveFile(writerFilter,kombatData.getArrayData());
  kombatData.dataAdd(); // save to graph for graph
  console.log()
}, 10 * 1000) // 10 s

// Safely close
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
    	kombatPort.close(function (err) {
		    console.log('port closed', err);
		} );
    	if(antennaPortNum != null)
    		antennaPort.close();

    	console.log('Close Port..');
    }

    // close CSV
    writerRAW.end();
    writerFilter.end();
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





