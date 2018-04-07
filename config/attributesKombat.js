const moment = require('moment-timezone'); //config timezone
moment().tz("Asia/Bangkok").format();

let param = {
  nama : 621, //header team
  ketinggian : 0 ,
  temperature : 0, 
  kelembaban : 0,
  tekanan : 0,
  arahAngin : 0,
  kecAngin : 0,
  latitude : 0.0,
  longitude : 0.0,
  startLatitude : 0.0 ,
  startLongitude : 0.0 ,
  endLatitude : 0.0,
  endLongitude : 0.0,
  imgAltitude : 0.0 ,
  imgTime : 0,
  co2 :0,
  pitch : 0,
  roll : 0,
  yaw : 0,
  graph : {
        ketinggian : [],
        temperature : [],
        kelembaban : [],
        tekanan : [],
        arahAngin : [],
        kecAngin : [],
        co2 : []
  },
  getData : ()=> {
    let res;
    res = param.nama + "\t" 
                  + moment().format("HH:mm:ss") + "\t"
                  + param.ketinggian + "\t" 
                  + param.temperature + "\t" 
                  + param.kelembaban + "\t" 
                  + param.tekanan + "\t" 
                  + parseFloat(param.arahAngin).toFixed(2) + "\t" 
                  + parseFloat(param.kecAngin).toFixed(2) + "\t" 
                  + param.latitude + "\t"
                  + param.longitude;
    return res;
  } ,
  logFile : ()=> {
    if (param.ketinggian >= 50 && param.ketinggian < 9500) {
      if ((param.ketinggian % 50 == 0) && (save == false)) {
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      } else if ((param.ketinggian % 50 == 1) && (save == false)){
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      } else if ((param.ketinggian % 50 == 2) && (save == false)) {
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      }else if ((param.ketinggian % 50 == 3) && (save == false)) {
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      }
      else if ((param.ketinggian % 50 == 4) && (save == false)) {
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      }else if ((param.ketinggian % 50 == 5) && (save == false)) {
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      }else if ((param.ketinggian % 50 == 6) && (save == false)) {
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      }else if ((param.ketinggian % 50 == 7) && (save == false)) {
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      }else if ((param.ketinggian % 50 == 8) && (save == false)) {
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      }else if ((param.ketinggian % 50 == 9) && (save == false)) {
        param.dataAdd();
        logger.write(param.data() + '\r\n'); //save log
        console.log("Save data to log.txt on " + param.ketinggian + " meter" );
        save = true;
      }
    }
  } , 
  dataAdd : ()=>{
        param.graph.ketinggian.push(param.ketinggian);
        param.graph.temperature.push(param.temperature);
        param.graph.kelembaban.push(param.kelembaban);
        param.graph.tekanan.push(param.tekanan);
        param.graph.arahAngin.push(param.arahAngin);
        param.graph.kecAngin.push(param.kecAngin);
        param.graph.co2.push(param.co2);
  },
  setData : (data)=> {
    /*
      Change this with the data incoming..
      Index   Data      Description
      [0]     Header    static var ID
      [1]     Altitude    ms5661 
      [2]     temperature SHT11
      [3]     kelembaban  SHT11
      [4]     tekananan  MS5661
      [5]     latitude   GPS NEO
      [6]     longitude  GPS NEO
      [7]     pitch     CMPS10
      [8]     roll      CMPS10
      [9]     yaw       CMPS10

      // set all incoming to suitable parameter
    */
    //param.ketinggian  = data[1];
    param.ketinggian = param.ketinggian + 1;

    if (data[2] != "0.00") {
      param.temperature = data[2]; 
      param.kelembaban  = data[3];
    }
    param.tekanan = data[4];
    if (data[5] != "********** " || data[6] != "0.000000 " || data[6] != "0.000000" ) {
      if (!isNaN(data[5]) && !isNaN(data[6])) {
        param.latitude    = data[5];
        param.longitude   = data[6];
      }
    }
    param.pitch = data[7];
    param.roll  = data[8];
    param.yaw   = data[9];
  },
  getBearing_WindSpeed : ()=>{
    /*
      Calculate Bearing and wind speed
    */
    // delay 1 seconds to get first gps data
    setTimeout( ()=>{
      param.startLatitude = param.latitude;
      param.startLongitude = param.longitude;
    }, 1000);

    // after delay 1 seconds 
    param.endLatitude = param.latitude;
    param.endLongitude = param.longitude;

    // check startLatitude not endLatitude or startLongitude not endLongitude
    if(param.startLongitude != param.endLongitude || param.startLatitude != param.endLatitude){
      let bearing = getBearing(param.startLatitude, param.startLongitude, param.endLatitude, param.endLongitude);
      let dist = distance(param.startLatitude, param.startLongitude, param.endLatitude, param.endLongitude);

      if(!isNaN(bearing))
        param.arahAngin = bearing; // set calcuate bearing as arah angin (degree)

      if(!isNaN(dist))
        param.kecAngin = dist; // set distance as kecepatan angin (m/s)
    }
  },
  getAzimuthAT : (homeLat,homeLon) =>{
    /*
      input Home Latitude - Home Longitude antenna Tracker
      output sudut azimuth antenna tracker
    */
    return parseInt(getBearing(homeLat, homeLon, param.latitude, param.longitude));
  },
  getElevationAT : (homeLat,homeLon)=>{
    /*
      input Home Latitude - Home Longitude antenna Tracker
      output sudut elevasi antenna tracker
    */
    return parseInt(getElevation(homeLat, homeLon, param.latitude, param.longitude, param.ketinggian));
  }
};


// GPS Calculation
/*
  Bearing give arahAngin and Azimuth 
  Distance give kecepatan angin
  Elevation give antennaTrackerElevation
*/

function radians(n) {
  return n * (Math.PI / 180);
}

function degrees(n) {
  return n * (180 / Math.PI);
}

function getBearing(startLat,startLong,endLat,endLong){
  startLat = parseFloat(startLat);
  startLong = parseFloat(startLong);
  endLat = parseFloat(endLat);
  endLong = parseFloat(endLong);

  startLat = radians(startLat);
  startLong = radians(startLong);
  endLat = radians(endLat);
  endLong = radians(endLong);

  var dLong = endLong - startLong;

  var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
  if (Math.abs(dLong) > Math.PI){
    if (dLong > 0.0)
       dLong = -(2.0 * Math.PI - dLong);
    else
       dLong = (2.0 * Math.PI + dLong);
  }

  var bearingDegree = (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0; 
  
  if (!Number.isNaN(bearingDegree))
    return bearingDegree;
}

function getElevation(startLat, startLong, endLat, endLong , alt){
  startLat = parseFloat(startLat);
  startLong = parseFloat(startLong);
  endLat = parseFloat(endLat);
  endLong = parseFloat(endLong);

  startLat = radians(startLat);
  startLong = radians(startLong);
  endLat = radians(endLat);
  endLong = radians(endLong);

  var delLat = endLat - startLat;
  var delLon = endLong - startLong;

  var R = 6372795;
  var q = Math.sin(delLat/2)*Math.sin(delLat/2);
  var w = Math.cos(startLat)*Math.cos(endLat);
  var e = Math.sin(delLon/2)*Math.sin(delLon/2);
  var a = (q + w*e);
  var c = 2*Math.atan2(Math.sqrt(a) , Math.sqrt(1-a));
  var distance = c * R;

  var elev = degrees(Math.atan(alt/distance));
  
  if (!Number.isNaN(elev))
    return elev;
}

/**
 * Calculate distance between two points in latitude and longitude taking
 * into account height difference. If you are not interested in height
 * difference pass 0.0. Uses Haversine method as its base.
 * 
 * lat1, lon1 Start point lat2, lon2 End point el1 Start altitude in meters
 * el2 End altitude in meters
 * @returns Distance in Meters
 */
function distance(lat1,lon1,lat2,
        lon2, el1,  el2) {

    var R = 6371; // Radius of the earth
    el1 = 0;
    el2 = 0;

    var latDistance = radians(lat2 - lat1);
    var lonDistance = radians(lon2 - lon1);
    var a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
            + Math.cos(radians(lat1)) * Math.cos(radians(lat2))
            * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c * 1000; // convert to meters

    var height = el1 - el2;

    var distance = Math.pow(distance, 2) + Math.pow(height, 2);

    if (distance < 100)
      return Math.sqrt(distance).toFixed(2);
}


module.exports = param;