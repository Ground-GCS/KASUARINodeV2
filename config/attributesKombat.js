const moment = require('moment-timezone'); //config timezone
moment().tz("Asia/Bangkok").format();

let firstTimes = true;
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
  prevLat : 0.0,
  prevLon : 0.0,
  notValidMovement : false ,
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
    if (data[1] >= 0 ){
      param.ketinggian  = data[1];
    }
  //param.ketinggian = param.ketinggian + 1; // uncomment this if demo ketinggian

    if (data[2] != "0.00") {
      param.temperature = data[2]; 
      param.kelembaban  = data[3];
    }
    param.tekanan = data[4];
    if (data[5] != "********** " || data[6] != "0.000000 " || data[6] != "0.000000" ) {
      if (!isNaN(data[5]) && !isNaN(data[6])) {
      
        if (firstTimes){
          // let for the first time set latitude and longitue
           param.latitude    = data[5];
           param.longitude   = data[6];
        }
        firstTimes = false; // set it to false

        param.setValidGPS(data[5],data[6]); // update point if dist > 1
      }
    }
    param.pitch = data[7];
    param.roll  = data[8];
    param.yaw   = data[9];
  },
  setValidGPS :(lat,lon) =>{
    /*
    if distance < 1 dont update the gps 
    */
    // delay 1 seconds to get first gps data
    
    setTimeout( ()=>{
      param.prevLat = lat;
      param.prevLon = lon;
    }, 1000);

    // after delay 1 seconds 
    let dist = 0;
    //console.log(lat,lon);
    //console.log(param.prevLat,param.prevLon);
    // using vincenty
    // distVincenty(param.prevLat, param.prevLon, lat, lon, function (distance) {
    //   dist = distance;
    //   console.log("distance :" + distance);
    // });

    //using heaversine
    dist = distance(param.prevLat, param.prevLon, lat, lon);
    console.log("Distance Initial: " + dist);
    let bearing = getBearing(param.prevLat, param.prevLon, lat, lon);

      
    //console.log(dist);

    // check distance greater than 1 m/s and under 1000 m/s
    // /console.log("distance :" + dist);
    if (dist >= 0.1 && dist < 1000){
      param.latitude = lat;
      param.longitude = lon;
      param.kecAngin = dist;
      param.arahAngin = bearing;
      console.log("Set lat lon");
      console.log("Kecepatan Angin : " + param.kecAngin);
      console.log("Arah ANgin : " + param.arahAngin);
      //console.log("Set lat lon");
      //param.getBearing_WindSpeed();
    } else {
      param.notValidMovement = true;
    }

  },
  getBearing_WindSpeed : ()=>{
    /*
      Calculate Bearing and wind speed
    */
    // delay 1 seconds to get first gps data
    // cek valid movement = false
      console.log("set speed and bearing");
      setTimeout( ()=>{
        param.startLatitude = param.latitude;
        param.startLongitude = param.longitude;
      }, 1000);

      // after delay 1 seconds 
      param.endLatitude = param.latitude;
      param.endLongitude = param.longitude;

      // check startLatitude not endLatitude or startLongitude not endLongitude
      //if(param.startLongitude != param.endLongitude || param.startLatitude != param.endLatitude){
        // using heaversine formula
         let bearing = getBearing(param.startLatitude, param.startLongitude, param.endLatitude, param.endLongitude);
         let dist = distance(param.startLatitude, param.startLongitude, param.endLatitude, param.endLongitude);


         if(!isNaN(dist))
           param.kecAngin = dist; // set distance as kecepatan angin (m/s)

         if(!isNaN(bearing))
           param.arahAngin = bearing; // set calcuate bearing as arah angin (degree)
      
        //using vincenity formula
        // distVincenty(param.startLatitude, param.startLongitude, param.endLatitude, param.endLongitude, function (distance, initialBearing, finalBearing) {
        //     //console.log(distance, initialBearing, finalBearing);
        //     param.kecAngin = distance;
        //     param.arahAngin = finalBearing;
        // });
    //  }
    //}
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
  },
  getArrayData :()=>{
    let arr = [];
    /*
    headers: [
      "ID", 
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
    */
    arr.push(param.nama); // ID
    arr.push(moment().format("HH:mm:ss")); //waktu
    arr.push(param.ketinggian);
    arr.push(param.temperature);
    arr.push(param.kelembaban);
    arr.push(param.tekanan);
    arr.push(param.arahAngin);
    arr.push(param.kecAngin);
    arr.push(param.latitude);
    arr.push(param.longitude);

    return arr;
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

  let dLong = endLong - startLong;

  let dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
  if (Math.abs(dLong) > Math.PI){
    if (dLong > 0.0)
       dLong = -(2.0 * Math.PI - dLong);
    else
       dLong = (2.0 * Math.PI + dLong);
  }

  let bearingDegree = (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0; 
  
  if (!Number.isNaN(bearingDegree))
    return bearingDegree.toFixed(2);
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

  let delLat = endLat - startLat;
  let delLon = endLong - startLong;

  let R = 6372795;
  let q = Math.sin(delLat/2)*Math.sin(delLat/2);
  let w = Math.cos(startLat)*Math.cos(endLat);
  let e = Math.sin(delLon/2)*Math.sin(delLon/2);
  let a = (q + w*e);
  let c = 2*Math.atan2(Math.sqrt(a) , Math.sqrt(1-a));
  let distance = c * R;

  let elev = degrees(Math.atan(alt/distance));
  
  if (!Number.isNaN(elev))
    return elev.toFixed(2);
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
function distance(lat1,lon1,lat2,lon2, el1,  el2) {

  let R = 6371; // Radius of the earth
  el1 = 0;
  el2 = 0;

  let latDistance = radians(lat2 - lat1);
  let lonDistance = radians(lon2 - lon1);
  let a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
          + Math.cos(radians(lat1)) * Math.cos(radians(lat2))
          * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distanceRes = R * c * 1000; // convert to meters

  let height = el1 - el2;

  let distance = Math.pow(distanceRes, 2) + Math.pow(height, 2);

  if (distance < 100)
    return Math.sqrt(distance).toFixed(2);
}


// https://github.com/TankofVines/node-vincenty/blob/master/vincenty.js
function distVincenty(lat1, lon1, lat2, lon2, callback) {

  lat1 = parseFloat(lat1);
  lon1 = parseFloat(lon1);
  lat2 = parseFloat(lat2);
  lon2 = parseFloat(lon2);
  var a = 6378137,
    b = 6356752.314245,
    f = 1 / 298.257223563;  // WGS-84 ellipsoid params

  var L = radians(( lon2 - lon1 ));
  var U1 = Math.atan(( 1 - f ) * Math.tan( radians(lat1) ));
  var U2 = Math.atan(( 1 - f ) * Math.tan( radians(lat2) ));
  var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  var sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

  var lambda = L, lambdaP, iterLimit = 100;
  do {
    var sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
    var sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) +
      (cosU1*sinU2-sinU1*cosU2*cosLambda) * (cosU1*sinU2-sinU1*cosU2*cosLambda));
    if (sinSigma==0) {
      var result = { distance: 0, initialBearing: 0, finalBearing: 0 };
      if (callback !== undefined && callback instanceof Function) {
        if (callback.length === 3) {
          callback(result.distance, result.initialBearing, result.finalBearing);
        }
        else {
          callback(result.distance);
        }
      }
      return result;
    };  // co-incident points
    var cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda;
    var sigma = Math.atan2(sinSigma, cosSigma);
    var sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
    var cosSqAlpha = 1 - sinAlpha*sinAlpha;
    var cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;
    if (isNaN(cos2SigmaM)) cos2SigmaM = 0;  // equatorial line: cosSqAlpha=0 (§6)
    var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
    lambdaP = lambda;
    lambda = L + (1-C) * f * sinAlpha *
      (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
  } while (Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0);

  if (iterLimit==0) return NaN  // formula failed to converge

  var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
  var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
  var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
  var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
    B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
  var s = b*A*(sigma-deltaSigma);

  s = Number(s.toFixed(3)); // round to 1mm precision

  // note: to return initial/final bearings in addition to distance, use something like:
  var fwdAz = Math.atan2(cosU2*sinLambda,  cosU1*sinU2-sinU1*cosU2*cosLambda);
  var revAz = Math.atan2(cosU1*sinLambda, -sinU1*cosU2+cosU1*sinU2*cosLambda);
  var result = { distance: s, initialBearing: degrees(fwdAz), finalBearing: degrees(revAz) };

  if (callback !== undefined && callback instanceof Function) {
    if (callback.length === 3) {
      callback(result.distance, result.initialBearing, result.finalBearing);
    }
    else {
      callback(result.distance);
    }
  }

  return result;
}


module.exports = param;