$(document).ready(function(){

  // facebook stuff
  FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
  });
  // facebook stuff ends


  Parse.initialize("4KuCyKG4NwJsde9Sp3nk61CRUdbyDWwl6kAQMcUp", "26kKlSsP9gsgwQ96qeI6GOf0ndAzqI3G9iTPLgUl");
  var ParseNote = Parse.Object.extend("Note");
  var query = new Parse.Query(ParseNote);

  query.find({
    success: function(results){
      // notes loaded
      console.log("Testing: loaded data from the database");
      displayResultsOnDOM(results);
    },
    error: function(error){
      console.log("Error: " + error);
    }
  });

  function displayResultsOnDOM(results){
    for(index in results){
      resultId = results[index].id;
      resultNote = results[index].attributes.note;
      if(results[index].attributes.done == false){
        var resultNode = "<p><input class='toggle' type='checkbox' id=" + resultId + "/> &nbsp;" + "<span>" + resultNote + "</span>" + "</p>";}
      else{
        var resultNode = "<p><input class='toggle' type='checkbox' id=" + resultId + " checked/> &nbsp;" + "<span style='text-decoration: line-through;'>" + resultNote + "</span>" + "</p>";
      }
      resultNode = resultNode;
      $('.notemaking-form').append(resultNode)
    }
  }

  $(".notemaking-form > input[type='submit']").on('click', function(e){
    e.preventDefault();
    console.log("TESTING: clicked");
    var note = $(".notemaking-form>input[type='text']").val();

    if(note.length==0){ alert("The note cannot be blank"); }
    else{
      var parseNote = new ParseNote();
      parseNote.set("note", note);
      parseNote.set("done", false);
      parseNote.save(null, {
        success: function(savedNote){
          console.log("Note: " + savedNote.attributes.note)
          $(".notemaking-form>input[type='text']").val("");
          var newNote = "<p><input class='toggle' type='checkbox' id=" + savedNote.id + "/> &nbsp;" + "<span>" + savedNote.attributes.note + "</span>" + "</p>";
          newNote = $(newNote);
          $('.notemaking-form').append(newNote);
        },
        error: function(){
          alert("The note cannot be saved");
        }
      });
    }
  });

  $('.notemaking-form').on('click', '.toggle', function(){

    // do this when checkbox is checked
    if($(this).is(':checked')){
      var thisNote = $(this)
      var noteId = $(this).attr('id').replace(/\/$/, '');
      console.log("TESTING | noteId: " + noteId);
      query.get(noteId, {
        success: function(updatedNote){
          updatedNote.set("done", true);
          updatedNote.save(null, {
            success: function(){
              console.log("Marked done");
              thisNote.parent().find('span').css('text-decoration' ,'line-through');
            },
            error: function(){console.log("Update failed: Cannot mark done");}
          });
        },
        error: function(){
          console.log("This is an error");
        }
      });
    }

    // else do this
    else { 
      var thisNote = $(this);
      var noteId = $(this).attr('id').replace(/\/$/, '');
      console.log("TESTING | noteId: " + noteId);
      query.get(noteId, {
        success: function(updatedNote){
          updatedNote.set("done", false);
          updatedNote.save(null, {
            success: function(){
              console.log("Marked undone");
              thisNote.parent().find('span').css('text-decoration' ,'none');
            },
            error: function(){console.log("Update failed: cannot Mark undone");}
          });
        },
        error: function(){
          console.log("This is an error");
        }
      });
    }
  });

  

});