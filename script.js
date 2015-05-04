    $(document).ready(function(){

      Parse.initialize("4KuCyKG4NwJsde9Sp3nk61CRUdbyDWwl6kAQMcUp", "26kKlSsP9gsgwQ96qeI6GOf0ndAzqI3G9iTPLgUl");
      var ParseNote = Parse.Object.extend("Note");
      var query = new Parse.Query(ParseNote);

      query.equalTo("done", false);
      var result = null;
      query.find({
        success: function(results){
          // notes loaded
          console.log("Testing: loaded data from the database");
          displayUndoneResultsOnDOM(results);
        },
        error: function(error){
          console.log("Error: " + error);
        }
      });

      function displayUndoneResultsOnDOM(results){
        for(index in results){
          resultId = results[index].id;
          resultNote = results[index].attributes.note;
          var resultNode = "<p><input class='toggle' type='checkbox' id=" + resultId + "/> &nbsp;" + "<span>" + resultNote + "</span>" + "</p>";
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
        if($(this).is(':checked')){
          var thisNote = $(this)
          var noteId = $(this).attr('id').replace(/\/$/, '');
          console.log("TESTING | noteId: " + noteId);
          query.get(noteId, {
            success: function(updatedNote){
              updatedNote.set("done", true);
              updatedNote.save();
              thisNote.parent().remove();
            },
            error: function(){
              console.log("This is an error");
            }
          });
        }
        else { console.log("no"); }
      });

    });