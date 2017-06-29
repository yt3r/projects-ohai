$(document).ready(function(){

  $('#main').on('submit', function(event){
    event.preventDefault();

    var query = $('input').val();
    console.log(query);

    var ajax = {
      url: "https://en.wikipedia.org/w/api.php",
      data: {
        action: 'opensearch',
        format: 'json',
        formatversion: '2',
        search: query,
        namespace: '0'
      },
      dataType: 'jsonp',
      success: function(data){
        console.log(data);
        if ($('#results').hasClass('added')){
          $('#results').empty().removeClass('added');
        }
        var card ='';
        if (data[1].length === 0){
          card = "<h3>No results for '"+query+"'</h3>";
          $('#results').last().append(card).addClass('added');
        } else {
            for (var i= 0; i<data[1].length; i++){
            var title = data[1][i];
            var snippet = data[2][i];
            var link = data[3][i];

            card = "<article data-link='" +link+ "'><h1>"+ title +"</h1><h3>"+snippet+"</h3></article>";
            $('#results').last().append(card).addClass('added');
          }
        }
      }
    };

    $.ajax(ajax);
  });

  $('#results').on('click', 'article', function(event){
    console.log($(this).attr('data-link'));
    window.open($(this).attr('data-link'));
    $(this).addClass('visited');
  });

});
