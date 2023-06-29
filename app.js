//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-prashant:test123@cluster0.cujx4vi.mongodb.net/todoListDB",{useNewUrlParser:true});
const itmsSchema={
  name:String
};
const Item= mongoose.model("Item",itmsSchema);
const item1=new Item({
  name:"welcome to your todo list"
});
const item2=new Item({
  name:"Hit the + button to add a new items"
});
const item3=new Item({
  name:"<-----------hit this to delete an itgem."
});
const defaultItems=[item1,item2,item3];
const ListSchema={
  name:String,
  items:[itmsSchema]
};
const List=mongoose.model("List",ListSchema);
const day = date.getDate();


  

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function(req, res) {
  Item.find({}).then(function(foundItems){
    if(foundItems.length==0)
    {
      Item.insertMany(defaultItems).then( function() {
  
        console.log("successfully save items in database")
        
    response.redirect("/");
      }).catch(function(err)
      {
        console.log(err)
      });
    
    
    }
    else{
    

  res.render("list", {listTitle: day, newListItems:foundItems});
    }
  })
  .catch(function(err){
    console.log(err);
  });
})



  
  

   



// const day = date.getDate();

  // res.render("list", {listTitle: day, newListItems: items});



app.post("/", function(req, res){

   const item = req.body.newItem;
   const listName=req.body.list;
   const newItem=new Item({
    name:item
   })
   
   if (listName==day){
   
  
   newItem.save();
   res.redirect("/");
  }
  else{
    List.findOne({name:listName}).then(function(foundList1){
      console.log(foundList1)
      foundList1.items.push(newItem)
      foundList1.save();
      res.redirect("/list/"+listName)
    }).catch(function(err){
      console.log(err);
     }) 
  }


  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});
app.get("/list/:customlink",function(req,res){
  const customListName = req.params.customlink;
  
  List.findOne({name:customListName}).then(function(foundList){
    if(!foundList){
      
      const list= new List({
        name:customListName,
        items:defaultItems
        })
        list.save();
        res.redirect("/list/"+customListName)

    }
   
    else
    {
      res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
  
    
  }
  })



  })
app.post("/delete", function(req,res){
  
  const checkeItemId= req.body.selectedBox;
  const checkTitle=req.body.listName;
  
  if (checkTitle==day){
    Item.findByIdAndRemove(checkeItemId).then(function(){
      console.log("sucessfully deleted")
    }).catch(function(err){
      console.log(err);
    })
    res.redirect("/")

  }
  else
  {
    List.findOneAndUpdate({name:checkTitle},{$pull:{items:{_id:checkeItemId}}}).then(function(foundItem){
      
      res.redirect("/list/"+checkTitle);

    })
  }
 
  
});
// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
