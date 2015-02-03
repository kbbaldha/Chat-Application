var Note = Backbone.Model.extend({
    defaults:{
        name: null,
        pages: null
    },
    initialize: function () { },
    urlRoot: '/books'   

});

var newNote = new Note({
    name: 'angels and demons',
    pages: 88,
});
console.log(newNote);
newNote.save({"keyur": "baldha"}, {
    success: function (model, response) {
        console.log("success");
    },
    error: function (model, response) {
        console.log("error");
    }
});


newNote.set('name', 'newName').save();