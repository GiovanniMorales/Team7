// gameplayState constructor

let gameplayState = function(){
	
};

gameplayState.prototype.create = function(){

	//important variables
	this.location = null; //current location
	this.inventorySize = 0; //number of objects in inventory
	this.reading = "none"; //what are we reading
	this.booksheet = null; //the current booksheet that is open

	//UI sprites
	this.surgery = game.add.sprite(0,0,"surgery");
	this.library = game.add.sprite(0,0,"library");
	this.museum = game.add.sprite(0,0,"museum");
	this.locations = game.add.sprite(0, 0, "locations");
	this.inventory = game.add.sprite(0, game.world.height - 200, "inventory");
	this.surgeryIcon = game.add.sprite(100, 100, "surgeryIcon");
	this.libraryIcon = game.add.sprite(300, 100, "libraryIcon");
	this.museumIcon = game.add.sprite(500, 100, "museumIcon");
	this.docIcon = game.add.sprite(900, 100, "docIcon");

	//window sprites
	this.document = game.add.sprite(300, 500, "document");
	this.book1sheet = game.add.sprite(100, 500, "book1sheet"); this.book1sheet.scale.set(30,30);
	this.book2sheet = game.add.sprite(100, 500, "book1sheet"); this.book2sheet.scale.set(30,30);
	this.book3sheet = game.add.sprite(100, 500, "book1sheet"); this.book3sheet.scale.set(30,30);
	this.book4sheet = game.add.sprite(100, 500, "book1sheet"); this.book4sheet.scale.set(30,30);
	this.viewjar1 = game.add.sprite(100, 500, "viewjar1");
	this.viewjar2 = game.add.sprite(100, 500, "viewjar2");
	this.viewjar3 = game.add.sprite(100, 500, "viewjar3");
	this.viewjar4 = game.add.sprite(100, 500, "viewjar4");
	this.closeX = game.add.sprite(900,700,"closeX");
	this.rightArrow = game.add.sprite(900,1400,"rightArrow");
	this.leftArrow = game.add.sprite(200,1400,"leftArrow");
	this.windowSprites = [];
	this.windowSprites.push(this.document);
	this.windowSprites.push(this.book1sheet);
	this.windowSprites.push(this.book2sheet);
	this.windowSprites.push(this.book3sheet);
	this.windowSprites.push(this.book4sheet);
	this.windowSprites.push(this.viewjar1);
	this.windowSprites.push(this.viewjar2);
	this.windowSprites.push(this.viewjar3);
	this.windowSprites.push(this.viewjar4);
	this.windowSprites.push(this.closeX);
	this.windowSprites.push(this.rightArrow);
	this.windowSprites.push(this.leftArrow);

	//surgery objects
	this.surgeryObjects = [];
	this.surgeryObjects.push(game.add.existing(new Organ(400,700,"heart",[{x:0,y:0,angle:0}])));
	this.surgeryObjects.push(game.add.existing(new Organ(400,900,"lungs",[{x:0,y:0,angle:0}])));
	this.surgeryObjects.push(game.add.existing(new Organ(400,1300,"liver",[{x:0,y:0,angle:0}])));
	this.surgeryObjects.push(game.add.existing(new Organ(400,1500,"stomach",[{x:0,y:0,angle:0}])));

	//library objects
	this.libraryObjects = [];
	this.libraryObjects.push(game.add.sprite(300,500,"book1"));
	this.libraryObjects.push(game.add.sprite(300,800,"book2"));
	this.libraryObjects.push(game.add.sprite(300,1100,"book3"));
	this.libraryObjects.push(game.add.sprite(300,1400,"book4"));

	//museum objects
	this.museumObjects = [];
	this.museumObjects.push(game.add.sprite(300,500,"jar1"));
	this.museumObjects.push(game.add.sprite(300,800,"jar2"));
	this.museumObjects.push(game.add.sprite(300,1100,"jar3"));
	this.museumObjects.push(game.add.sprite(300,1400,"jar4"));

	//allow input for buttons
	this.surgeryIcon.inputEnabled = true;
	this.surgeryIcon.events.onInputUp.add(this.surgeryIconTap, this);
	this.libraryIcon.inputEnabled = true;
	this.libraryIcon.events.onInputUp.add(this.libraryIconTap, this);
	this.museumIcon.inputEnabled = true;
	this.museumIcon.events.onInputUp.add(this.museumIconTap, this);
	this.docIcon.inputEnabled = true;
	this.docIcon.events.onInputUp.add(this.docIconTap, this);
	this.closeX.inputEnabled = true;
	this.closeX.events.onInputUp.add(this.close, this);
	this.rightArrow.inputEnabled = true;
	this.rightArrow.events.onInputUp.add(this.nextPage, this);
	this.leftArrow.inputEnabled = true;
	this.leftArrow.events.onInputUp.add(this.prevPage, this);

	//allow input for surgeryObjects
	for (var i = 0; i < this.surgeryObjects.length; i++){
		this.surgeryObjects[i].inventory = false;
		this.surgeryObjects[i].inputEnabled = true;
		this.surgeryObjects[i].input.enableDrag(true);
		this.surgeryObjects[i].events.onInputUp.add(this.addToInventory, this);
	}

	//allow input for libraryObjects
	for (var i = 0; i < this.libraryObjects.length; i++){
		this.libraryObjects[i].inputEnabled = true;
		this.libraryObjects[i].events.onInputUp.add(this.open, this);
	}

	//allow input for museumObjects
	for (var i = 0; i < this.museumObjects.length; i++){
		this.museumObjects[i].inputEnabled = true;
		this.museumObjects[i].events.onInputUp.add(this.view, this);
	}

	//bring window sprites to front, center, and turn invisible
	for (var i = 0; i < this.windowSprites.length; i++){
		game.world.bringToTop(this.windowSprites[i]);
		this.center(this.windowSprites[i]);
		this.windowSprites[i].visible = false;
	}
	
	//set specific locations for closeX and arrows
	this.setPos(this.closeX, 910, 430);
	this.setPos(this.rightArrow, 850, 1800);
	this.setPos(this.leftArrow, 150, 1800);

	this.loadSurgery();
};

gameplayState.prototype.update = function(){

	//disable in game objects input while reading
	if (this.reading == "none"){
		for (var i = 0; i < this.surgeryObjects.length; i++){
			this.surgeryObjects[i].inputEnabled = true;
		}
		for (var i = 0; i < this.libraryObjects.length; i++){
			this.libraryObjects[i].inputEnabled = true;
		}
		for (var i = 0; i < this.museumObjects.length; i++){
			this.museumObjects[i].inputEnabled = true;
		}
	}
	else{
		for (var i = 0; i < this.surgeryObjects.length; i++){
			this.surgeryObjects[i].inputEnabled = false;
		}
		for (var i = 0; i < this.libraryObjects.length; i++){
			this.libraryObjects[i].inputEnabled = false;
		}
		for (var i = 0; i < this.museumObjects.length; i++){
			this.museumObjects[i].inputEnabled = false;
		}
	}
};

//switches to the surgery location
gameplayState.prototype.loadSurgery = function(){
	this.location = "surgery";
	this.surgery.visible = true;
	this.library.visible = false;
	this.museum.visible = false;
	for (var i = 0; i < this.surgeryObjects.length; i++){
		this.surgeryObjects[i].visible = true;
	}
	for (var i = 0; i < this.libraryObjects.length; i++){
		this.libraryObjects[i].visible = false;
	}
	for (var i = 0; i < this.museumObjects.length; i++){
		this.museumObjects[i].visible = false;
	}
}

//switches to the library location
gameplayState.prototype.loadLibrary = function(){
	this.location = "library";
	this.surgery.visible = false;
	this.library.visible = true;
	this.museum.visible = false;
	for (var i = 0; i < this.surgeryObjects.length; i++){
		if (this.surgeryObjects[i].inventory == false){ //allow inventory to stay visible
			this.surgeryObjects[i].visible = false;
		}
	}
	for (var i = 0; i < this.libraryObjects.length; i++){
		this.libraryObjects[i].visible = true;
	}
	for (var i = 0; i < this.museumObjects.length; i++){
		this.museumObjects[i].visible = false;
	}
}

//switches to the museum location
gameplayState.prototype.loadMuseum = function(){
	this.location = "museum";
	this.surgery.visible = false;
	this.library.visible = false;
	this.museum.visible = true;
	for (var i = 0; i < this.surgeryObjects.length; i++){
		if (this.surgeryObjects[i].inventory == false){ //allow inventory to stay visible
			this.surgeryObjects[i].visible = false;
		}
	}
	for (var i = 0; i < this.libraryObjects.length; i++){
		this.libraryObjects[i].visible = false;
	}
	for (var i = 0; i < this.museumObjects.length; i++){
		this.museumObjects[i].visible = true;
	}
}

//button functions
gameplayState.prototype.surgeryIconTap = function(){
	if (this.reading == "none") { this.loadSurgery(); }
}
gameplayState.prototype.libraryIconTap = function(){
	if (this.reading == "none") { this.loadLibrary(); }
}
gameplayState.prototype.museumIconTap = function(){
	if (this.reading == "none") { this.loadMuseum(); }
}
gameplayState.prototype.docIconTap = function(){
	if (this.reading == "none") {
		this.document.visible = true;
		this.closeX.visible = true;
		this.reading = "document";
	}
}

//adds a surgeryObject to inventory
gameplayState.prototype.addToInventory = function(sprite, pointer){
	if (sprite.y > 1900){ //is sprite close to inventory?
		if (sprite.inventory == false){ //is it already in inventory?
			sprite.inventory = true;
			this.inventorySize++;
			sprite.scale.set(.4,.4);
			sprite.x = this.inventorySize*300 - 200;
			sprite.y = 2250;
			sprite.input.draggable = false;
		}
	}
}

//opens a book so that we can read it
gameplayState.prototype.open = function(sprite, pointer){
	this.booksheet = null;
	if (sprite == this.libraryObjects[0]){ this.booksheet = this.book1sheet; }
	else if (sprite == this.libraryObjects[1]){ this.booksheet = this.book2sheet; }
	else if (sprite == this.libraryObjects[2]){ this.booksheet = this.book3sheet; }
	else if (sprite == this.libraryObjects[3]){ this.booksheet = this.book4sheet; }
	this.booksheet.frame = 0; //set book to first page
	this.booksheet.visible = true;
	this.closeX.visible = true;
	this.rightArrow.visible = true;
	this.leftArrow.visible = true;
	this.reading = "book";
}

//close all window sprites
gameplayState.prototype.close = function(sprite, pointer){
	for (var i = 0; i < this.windowSprites.length; i++){
		this.windowSprites[i].visible = false;
	}
	this.reading = "none";
}

//turns to the next page in an opened book
gameplayState.prototype.nextPage = function(sprite, pointer){
	if (this.booksheet.frame < this.booksheet.animations.frameTotal - 1){
		this.booksheet.frame++;
	}
}

//turns to the previous page in an opened book
gameplayState.prototype.prevPage = function(sprite, pointer){
	if (this.booksheet.frame > 0){
		this.booksheet.frame--;
	}
}

//view jar
gameplayState.prototype.view = function(sprite, pointer){
	this.viewjar = null;
	if (sprite == this.museumObjects[0]){ this.viewjar = this.viewjar1; }
	else if (sprite == this.museumObjects[1]){ this.viewjar = this.viewjar2; }
	else if (sprite == this.museumObjects[2]){ this.viewjar = this.viewjar3; }
	else if (sprite == this.museumObjects[3]){ this.viewjar = this.viewjar4; }
	this.viewjar.visible = true;
	this.closeX.visible = true;
	this.reading = "jar";
}

//move sprite to center of screen
gameplayState.prototype.center = function(sprite){
	sprite.x = (game.world.width - sprite.width)/2;
	sprite.y = (game.world.height - sprite.height)/2;
}

//sets position of sprite
gameplayState.prototype.setPos = function(sprite, X, Y){
	sprite.x = X;
	sprite.y = Y;
}