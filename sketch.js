var dog,sadDog,happyDog;
var feedbutton,addfoodbutton;
var foodobj;
var database;
var foodS,foodStock,lastFed,FedTime;
function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  foodobj=new Food();
  foodStock=database.ref("Food");
  foodStock.on("value",readStock);
  feedbutton=createButton("Feed the dog");
  feedbutton.position(700,95);
  feedbutton.mousePressed(feedDog);
  addfoodbutton=createButton("Add Food");
  addfoodbutton.position(800,95);
  addfoodbutton.mousePressed(addFoods);
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
}

function draw() {
  background(46,139,87);
  foodobj.display();
  FedTime=database.ref("FeedTime");
  FedTime.on("value",function(data){
    lastFed=data.val();
  })
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
  drawSprites();
}

//function to read food Stock
 function readStock(data){
  foodS=data.val();
  foodobj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  if(foodobj.getFoodStock()<=0){
   foodobj.updateFoodStock(foodobj.getFoodStock()*0);
  }
  else{
    foodobj.updateFoodStock(foodobj.getFoodStock()-1);
  }
  database.ref("/").update({
    Food:foodobj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){ 
  foodS++;
  database.ref('/').update({
     Food:foodS 
    }) 
  }