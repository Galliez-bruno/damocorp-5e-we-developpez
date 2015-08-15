/*************************************** FONCTION *********************************************/
function affRetour(mess,laclass){
	if ( $('#reponse').length === 1 ){ $('#reponse').remove(); }
	if ( laclass === undefined ){ var laclass = 'good'; } else { var laclass = 'bad'; }
	$('body').prepend('<div id="reponse" class="'+laclass+'">'+mess+'</div>');
	$("#reponse").css('top', $(window).scrollTop() + 'px');
	setTimeout(function(){$('#reponse').fadeOut(2000,function(){$('#reponse').remove();});},4000);
}
/*************************************** VARIABLE *********************************************/
var elem,ctx = false;                     // le canvas
var windowHeight = window.innerHeight;    // hauteur fenetre
var windowWidth = window.innerWidth;      // largeur fenetre
var asteroide = new Array();              // tableau des objets astéroides
var posMouseX,posMouseY,cursor=false;     // position et état souris
var clickObject;                          // Click astéroide, station etc...
var keyClickObject;					      // Key de l'objet cliqué
var station;                              // affichage de la sation
var minerai,nrj,argent;                   // variable des ressource
var tmp;                                  // Variable de sauvegarde temporaire
var tauxRecolte=1;						  // Taux de récolte des astéroides
var palierUpRecolte=10;					  // Palier pour activer le up récolte
/*************************************** FONCTION ******************************************/
function loop(){

    // efface le canvas
    ctx.clearRect(0,0,windowWidth,windowHeight);

    // affichage des astéroides
    for ( key in asteroide ){
        asteroide[key].move();
        asteroide[key].draw();
    }

    // affiche la sation
    station.draw();

    // interaction souris
    interactCursor();

    // relance la boucle
    window.requestAnimFrame(loop);
}
// equivalent javascript de la fonction php number_format
function number_format(number, decimals, dec_point, thousands_sep) {
    decimals=0;dec_point=',';thousands_sep=' ';
    number = (number+'').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number, 
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
function clignotte(id){
    $('#'+id).delay(100).fadeTo(100,0.5).delay(100).fadeTo(100,1).delay(100).fadeTo(100,0.5).delay(100).fadeTo(100,1);
}
function affRetour(mess,laclass){
    if ( $('#reponse').length === 1 ){ $('#reponse').remove(); }
    if ( laclass === undefined ){ var laclass = 'reponseG'; } else { var laclass = 'reponseB'; }
    $('body').prepend('<div id="reponse" class="'+laclass+'">'+mess+'</div>');
    $("#reponse").css('top', $(window).scrollTop() + 'px');
    setTimeout(function(){$('#reponse').fadeOut(2000,function(){$('#reponse').remove();});},4000);
}
function genereAsteroide(){
    var rand = Math.random();
    if ( rand < 0.3 ){
        var tmp = new affImg('img/sprite_game.png',150,50,50,50,-50,-50);
    } else if ( rand > 0.3 && rand < 0.6 ){
        var tmp = new affImg('img/sprite_game.png',200,50,50,50,-50,-50);
    } else {
        var tmp = new affImg('img/sprite_game.png',250,50,50,50,-50,-50);
    }
    asteroide.push(tmp);
    tmp.resetPosition();
}
function interactCursor(){
    
    cursor = false;

    // La station
    if ( posMouseX > windowWidth/2-50 && posMouseX < windowWidth/2+50 && posMouseY > windowHeight/2-50 && posMouseY < windowHeight/2+50 ){
        cursor = true;
        clickObject='station';
    }
    // Les astéroides
    for ( key in asteroide ){
        if ( posMouseX > asteroide[key].posx && posMouseX < asteroide[key].posx+asteroide[key].affWidth && posMouseY > asteroide[key].posy && posMouseY < asteroide[key].posy+asteroide[key].affHeight ){
            cursor = true;
            clickObject = 'asteroide';
            keyClickObject = key;
            break;
        }
    }

    if ( cursor ){
        $('#canvas').css({'cursor':'pointer'});
    } else {
        $('#canvas').css({'cursor':'auto'});
    }
}
function interactClick(){
    // clic sur un astéroide
    
    if ( cursor && clickObject=='asteroide' ){
        // stock les positions de l'astéroides
        var x = asteroide[keyClickObject].posx+asteroide[keyClickObject].width;
        var y = asteroide[keyClickObject].posy-asteroide[keyClickObject].height/2;
        // affiche le gain sur l'écran
        affResultClick(x,y,'green','+'+tauxRecolte);
        // ajoute la récolte et actualise l'affichage
        if( asteroide[keyClickObject].srcX === 150 ){
        	minerai += tauxRecolte;
        } else if( asteroide[keyClickObject].srcX === 200 ){
        	nrj += tauxRecolte;
        } else {
        	argent += tauxRecolte;
        }
        actualiseStock();
    }
    
}
function actualiseStock(){
    // mets à jour l'affichage
    $('#minerai').html(number_format(minerai));
    $('#nrj').html(number_format(nrj));
    $('#argent').html(number_format(argent));

    // si l'argent dépasse le palier on active le up récolte
    if( argent >= palierUpRecolte ){
    	$('#imgRecolte').attr('src','img/uprecolte.gif');
    }
}
function affResultClick(x,y,color,chiffre){
	$('#affResultClick').css({'top':y+'px','left':x+'px','color':color,'opacity':100,'display':'block'});
	$('#affResultClick').html(chiffre);
	$('#affResultClick').fadeIn(250,function(){$('#affResultClick').fadeOut(250)});
}
function upTauxrecolte(){
	if ( argent >= palierUpRecolte ){
		//soustraire le montant et mettre à jour l'affichage
		argent -= palierUpRecolte;
		actualiseStock();
		//augmente le taux de récolte
		tauxRecolte++;
		// nouveau pallier
		palierUpRecolte+=tauxRecolte*tauxRecolte*10;
		// Mets à jour l'image d'upgrade du palier
		$('#imgRecolte').attr('src','img/uprecolteinactif.png');
		// mets à jour l'affichae du taux de récolte
		$('#affTauxRecolte').html(tauxRecolte);
	}
}
/************************************* OBJET ******************************************/
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame  ||
    window.mozRequestAnimationFrame     ||
    window.oRequestAnimationFrame       ||
    window.msRequestAnimationFrame      ||
    function(callback){
        window.setTimeout(callback, 1000/30);
    };
})();
var affImg = function(s,sX,sY,w,h,x,y){

    this.img = new Image();
    this.img.src = s;

    this.srcX = sX;
    this.srcY = sY;
    this.width = w;
    this.height = h;
    this.posx = x-this.width/2;
    this.posy = y-this.height/2;
    this.affWidth=w;
    this.affHeight=h;
    this.angle=false;
}
affImg.prototype.draw = function(){
    ctx.drawImage(this.img,this.srcX,this.srcY,this.width,this.height,this.posx,this.posy,this.affWidth,this.affHeight);
}
affImg.prototype.move = function(){

    this.posx+=this.sensX;
    this.posy+=this.sensY;

    // relance l'astéroide s'il sort de la zone
    if ( this.posx > windowWidth+250 || this.posy > windowHeight+250 || this.posx < -250 || this.posy < -250 ){
        this.resetPosition();
    }
}
affImg.prototype.resetPosition = function(){

    // vitesse de déplacement
    this.sensX=Math.random();
    if ( this.sensX < 0.1 ){ this.sensX = 0.1; }
    this.sensY=Math.random();
    if ( this.sensY < 0.1 ){ this.sensY = 0.1; }

    var rand = Math.random();
    // l'astéroide viens du haut
    if ( rand <= 0.25 ){

        this.posx= Math.floor(Math.random()*windowWidth);
        this.posy=-50;
        // l'astéroide part vers la gauche
        if ( this.posx > windowWidth/2){
            this.sensX--;
        }

    // l'astéroide viens de la droite
    } else if ( rand > 0.25 && rand <= 0.50 ){

        this.posx= windowWidth+50;
        this.posy= Math.floor(Math.random()*windowHeight);

        // l'astéroide part vers le haut et va vers la gauche
        this.sensX--;
        if ( this.posy > windowHeight/2){
            this.sensY--;
        }

    // l'astéroide viens du bas
    } else if ( rand > 0.25 && rand <= 0.50 ){

        this.posx= Math.floor(Math.random()*windowWidth);
        this.posy=windowHeight+50;
        // l'astéroide part vers le haut et va vers la gauche
        this.sensY--;
        if ( this.posx > windowWidth/2){
            this.sensX--;
        }

    // l'astéroide viens de la gauche
    } else {

        this.posx= -50;
        this.posy=Math.floor(Math.random()*windowHeight);
        // l'astéroide part vers le haut et va vers la gauche
        if ( this.posy > windowHeight/2){
            this.sensX--;
        }


    }

    // modifie la taille des astéroide
    rand = Math.random();
    var scale = (rand*5+5)/10;
    this.affWidth = this.width*scale;
    this.affHeight = this.height*scale;

    // modifie le type de l'astéroide
    if ( rand < 0.3 ){
        this.srcX=150;
    } else if ( rand > 0.3 && rand < 0.6 ){
        this.srcX=200;
    } else {
        this.srcX=250;
    }
}
/***************************************** JQUERY *********************************************/
$(document).ready(function(){

    // Ajout du canvas
    $('body').prepend('<canvas id="canvas" width="'+windowWidth+'" height="'+windowHeight+'"></canvas>');
    // Elem + ctx
    elem = document.getElementById('canvas');
    ctx = elem.getContext('2d');

    // stock les ressources dans des variables
    minerai = parseInt($('#minerai').html());
    nrj = parseInt($('#nrj').html());
    argent = parseInt($('#argent').html());
    // mets en forme l'affichage
    $('#minerai').html(number_format(minerai,0,',',' '));
    $('#nrj').html(number_format(nrj,0,',',' '));
    $('#argent').html(number_format(argent,0,',',' '));
    /***************************** Menu *********************************/
    $('#menu').css({'top':(windowHeight-50)+'px','left':(windowWidth/2-160)+'px'});
    /***************************** PREPARATION OBJET AFFICHAGE *********************************/
    // ajout de X astéroide
    for (var i=0; i<10; i++) {
        genereAsteroide();
    };
    // prépare l'affichage de la station
    station = new affImg('img/sprite_game.png',0,50,100,100,(windowWidth/2),(windowHeight/2));
    // prépare l'affichage du champ de force
    affImgChanpDeForce = new affImg('img/sprite_game.png',300,50,100,100,0,0);
    // prépare l'affichage de la navette de récupération astéroide
    affImgNavetteRecuperation = new affImg('img/sprite_game.png',150,100,50,50,0,0);
    // prépare l'affichage des lumières rouges
    affLumiere = new affImg('img/sprite_game.png',150,150,50,50,0,0);
    // prépare l'affichage de l'explosion'
    affExplosion = new affImg('img/sprite_game.png',0,200,50,50,0,0);

    //lancement de la boucle
    loop();

    /***************************** Click action ******************************/
    // Upgrader le taux de récolte
    $('#imgRecolte').click(function(){
    	if( $(this).attr('src') == 'img/uprecolte.gif' ){
    		upTauxrecolte();
    	}
    });

    /***************************** EVENEMENT *********************************/
    // curseur sur les objets
    document.getElementById('canvas').addEventListener('mousemove',function(e){posMouseX=e.pageX;posMouseY=e.pageY;},false);
    // clic sur un astéroide   
    document.getElementById('canvas').addEventListener('click',interactClick,false);
    // Fermeture du popup
    $('fermerPopop').click(function(){
        $('#fondPopup').remove();
    });
});
