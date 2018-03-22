const moment = require('moment-timezone'); //config timezone
moment().tz("Asia/Bangkok").format();

const param = {
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
    param.ketinggian  = data[1];

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
  }
};


module.exports = param;