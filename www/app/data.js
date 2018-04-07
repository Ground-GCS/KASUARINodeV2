var datahasil;
var Header,Waktu,Ketinggian,Temperature,Kelembaban,Tekanan,ArahAngin,KecAngin,Roll,Pitch,Yaw;
var totalPoints = 300;
var res = [],
    TempRes = [],
    KecRes = [],
    TekananRes = [],
    path = [];
var imgs;

var stage = Sprite3D.stage(document.querySelector("#sikap"));

var box = Sprite3D.box(100,150,100, ".cube");
box.rotation(0,0,0)
box.update();
// stage.setInnerHTML("sikap")
stage.appendChild(box);

  
function update() {
    var socket = io.connect();

    socket.on('kirim', function(data){
    /**
    
      on datahasil:
      -   param.ketinggian,
          param.temperature,
          param.kelembaban,
          param.tekanan,
          param.arahAngin,
          param.kecAngin,
          param.latitude,
          param.longitude,
          param.pitch,
          param.roll,
          param.yaw
     */
      Ketinggian = parseFloat(data.datahasil[0]);
      Temperature = parseFloat(data.datahasil[1]);
      Kelembaban = parseFloat(data.datahasil[2]);
      Tekanan = parseFloat(data.datahasil[3]);
      ArahAngin = parseFloat(data.datahasil[4]).toFixed(2);
      KecAngin = parseFloat(data.datahasil[5]).toFixed(2);
      Lintang = parseFloat(data.datahasil[6]);
      Bujur = parseFloat(data.datahasil[7]);
      Pitch = parseFloat(data.datahasil[8]); 
      Roll = parseFloat(data.datahasil[9]);
      Yaw = parseFloat(data.datahasil[10]);

      // no minus in Altitude
      if (Ketinggian < 0) {
        Ketinggian = 0;
      }


      //Tampil ke id class
	  $("#header").html(Header);
	  $("#waktu").html(Waktu);
	  $("#temperature").html(Temperature);
	  $("#kelembaban").html(Kelembaban);
	  $("#ketinggian").html(Ketinggian);
	  $("#tekanan").html(Tekanan);
	  $("#arahangin").html(ArahAngin);
	  $("#KecAngin").html(KecAngin);
	  $("#lintang").html(Lintang);
	  $("#bujur").html(Bujur);

   	// console.log((360.00-Pitch) + ' ' +  (360.00-Yaw) + ' ' + (360.00-Roll));
    //console.log((Pitch) + ' ' +  (Yaw) + ' ' + (Roll));
    box.rotation((Pitch), (360-Yaw), (Roll)).update();
  	//box.rotation((Pitch), (Yaw), (Roll)).update();

    });

}

var param = {
  graph : {
                ketinggian : [],
                temperature : [],
                kelembaban : [],
                tekanan : [],
                arahAngin : [],
                kecAngin : [],
                co2 : []
  },
  getDataTemperature : function(){
    return this.temperature;
  },
   getDataKelembaban: function(){
    return this.kelembaban;
  },
   getDataTekanan : function(){
    return this.tekanan;
  },
   getDataArahAngin : function(){
    return this.arahAngin;
  },
   getDataKecAngin : function(){
    return this.kecAngin;
  },
   getDataCo2 : function(){
    return this.co2;
   }
};





    