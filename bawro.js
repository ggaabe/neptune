Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});

if(Meteor.isClient){
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.layout.rendered = function () {
   Deps.autorun(function () {
   var self = this;
   thisCampaign = Session.get('campaign');
 })}

Template.borrow.helpers({
    availableToBorrow: function (){
      return availableItems.find({});
    }
});

Template.borrowed.helpers({
  availableToBorrow: function (){
    return availableItems.find({available: false});
  }
});

Template.loaned.helpers({
  availableToBorrow: function (){
    return availableItems.find({available: true});
  }
});

Template.item.helpers({
image: function (template) {
  console.log(this.photo._id);
  console.log(Images.findOne({ _id: this.photo._id }));
  return Images.findOne({ _id: this.photo._id }); // Where Images is an FS.Collection instance
}
});

Template.item.events({
  "click #borrow": function(event, template){
    var itemToUpdate = template.data._id;
    availableItems.update({_id:itemToUpdate}, {$set:{
      available: false,
      borrower: Meteor.userId()
    }});

    Collection.update({_id:idSelector}, {$set:{

    }});
    Meteor.users.update(Meteor.userId(), {
      $addToSet: {borrowedItems: itemToUpdate}    //later on initialize a borrowed array upon account registration.
    });


  }
});

Template.item.events({
  "click #return": function(event, template){
    var itemToUpdate = template.data._id;
    availableItems.update({_id:itemToUpdate}, {$set:{
      available: true,
      borrower: null
    }});

    Collection.update({_id:idSelector}, {$set:{

    }});
    Meteor.users.update(Meteor.userId(), {
      $addToSet: {borrowedItems: null}    //later on initialize a borrowed array upon account registration.
    });


  }
});

/*Template.borrowed.helpers({
borrowedItems: function(){
  var thisUser = Meteor.users.findOne(Meteor.userId());
  var borrowedItemIDs = thisUser.borrowedItems;

  //Only will work with one item for now. Forget the array/for each loop.
  //var borrowedItemArray = new Array();

  //borrowedItemIDs.forEach()
  /*for each (itemID in borrowedItemIDs){
      var borrowedItem = Collection.findOne({_id:itemID});
      borrowedItemArray.push(borrowedItem);
  }*/

/*
  return availableItems.findOne({_id:borrowedItemIDs});

}});*/



Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        });
        Router.go('/');
    }
})

Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password);
    }
});

Template.lend.events({
    'submit form': function(event, template){
        event.preventDefault();
      console.log("TEST");
        //var name = event.target.xyz.value;
        console.log(name);

        var name = $('#name').val();
        //var daysAvailable = $('#daysAvailable').val();
        var file = $('#file').get(0).files[0];
        var imageObject = Images.insert(file);

         availableItems.insert({
          name: name,
          loanTime: template.find("#number").value,
          borrower: null,
          photo: imageObject,
          quantity: 1,
          available: true,
          owner: Meteor.user().username,
          userID: Meteor.userId(),
          itemID: availableItems.find().count()
          //daysAvailable: daysAvailable
        });

            console.log(name);
            console.log(template.find("#number").value);
            return false;

    }
});

/*Template.lend.events({
'change .imageInput': function(event, template) {

}
});*/

Template.layout.events({
  'submit .new-task': function(event){
    event.preventDefault();
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();




  }
})
/*Template.layout.events({
     'click .logout': function(event){
       event.preventDefault();
       console.log("Running event");
       Meteor.logout(function() {
         Router.go('/login');
});
      }
  })
*/

}


if(Meteor.isServer){
    Images.allow({
    'insert': function () {
      // add custom authentication code here
      return true;
    }
  });
}


availableItems = new Mongo.Collection("items");
