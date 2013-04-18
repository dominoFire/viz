/** globals **/
var loc = document.getElementById('sLoc');
var rubro = document.getElementById('sRubro');
var vloc = loc.options[loc.selectedIndex].value;
var vrubro = rubro.options[rubro.selectedIndex].value;
var tloc = loc.options[loc.selectedIndex].text;
var trubro = rubro.options[rubro.selectedIndex].text;
var grows = null;
var sum = [0,0,0,0,0,0,0,0,0,0];
var nfilas = [0,0,0,0,0,0,0,0,0,0];
var firstTime = true;

var getFormData = function() 
{
	vloc = loc.options[loc.selectedIndex].value;
	vrubro = rubro.options[rubro.selectedIndex].value;
	tloc = loc.options[loc.selectedIndex].text;
	trubro = rubro.options[rubro.selectedIndex].text;
}

function addEvent(element, evnt, funct) 
{
  if (element.attachEvent)
		return element.attachEvent('on'+evnt, funct);
  else
		return element.addEventListener(evnt, funct, false);
}

var valida = function() 
{
	console.log('validatin');
	var p = document.getElementById("msg");
	if(vloc!="" && vrubro!="") {
		p.innerHTML = "";
		return true;
	}
	else if(vloc=="" && vrubro=="")  {
		p.innerHTML = "Selecciona el Rubro y el Tamaño de la localidad";
		return false;
	}
	else if(vloc=="") {
		p.innerHTML = "Selecciona el Tamaño de la localidad";
		return false;
	}
	else if(vrubro=="") {
		p.innerHTML = "Selecciona el Rubro";
		return false;
	}
}

var leeDatos = function() 
{
	d3.csv("data/tablas_enigh.csv")
		.row(function(d) { 
			return {
				Fila : +d.fila,
				Decil : +d.decil,
				Loc : d.tamanio_localidad,
				Marginacion : d.marginacion,
				N : +d.n,
				GastoProm : +d.gasto_prom,
				IngresoProm : +d.ingreso_prom,
				Rubro : d.rubro,
				PropIngreso : +d.prop_ingreso
			};  
		})
		.get(function(error, rows) {
			if(error!=null)
				return;
			grows = rows;
		});
		//joy!
}


var actualizaGrafica = function()
{
	getFormData();

	if(!valida())
		return;

	//init
	for(var i=0; i<10; i++) {
		sum[i] = 0;
		nfilas[i] = 0;
	}

	//seleccionar los datos
	console.log(tloc + ", " +trubro);
	for(var i =0; i<grows.length; i++) {
		if(tloc==grows[i].Loc &&
			 trubro==grows[i].Rubro) {

			sum[ grows[i].Decil - 1 ] += grows[i].PropIngreso * grows[i].N;
			nfilas[ grows[i].Decil - 1 ]++;
		}
	}
	//los juntamos
	console.log("Tam: " +sum.length);
	for(var i=0; i<sum.length; i++) {
		sum[i] = sum[i]/nfilas[i];
		console.log(sum[i]);
	}

	if(firstTime) {
		d3.select("svg") //crear el canvas
			.selectAll("rect")
			.data(sum) //pintar las gráficas
			.enter()
			.append("rect")
			.attr("transform", 
				function(d, i) { return "translate(0" +"," +(i*20) +")" })
			.attr("height", "20px")
			.attr("width", function(d) { return (d*10) + "px"; } )
			.attr("fill", function(d, i) { return "rgb(" +(i*25) +",25,23)"; });	
			firstTime = false;
	}
	else {
		d3.select("svg") //crear el canvas
			.selectAll("rect")
			.data(sum) //pintar las gráficas
			.attr("width", function(d) { return (d*10) + "px"; } );
	}
	
}

/** MAIN **/
leeDatos();
addEvent(loc, 'click', actualizaGrafica);
addEvent(rubro, 'click', actualizaGrafica);