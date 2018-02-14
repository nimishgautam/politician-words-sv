
var currentParty="";
var firstResultsReturned = false;

function createPartySelector(){
    for( var party in parties ){
        var party_container = $('<div></div>', {
            class: 'party_container',
            text: '\xa0', // &nbsp; in JS
            title: parties[party]['fullname'],
        }).attr('data-party', party)
          .css('background-image', 'url("./logos/'+ parties[party]['letter'] + '.' +parties[party]['logo']+'")')
          .click(function(){
            var state = $('#party_selector').attr('data-state');
            if(state == 'open'){
                currentParty = $(this).attr('data-party');
                $('#party_selector').animate({
                    width: 110,
                    scrollLeft: $(this).position().left,
                    'margin-left': '45%'
                }, 1000, null); 
                $('#party_selector').attr('data-state', 'closed');
              }
              else { //closed, open it up
                currentParty = "";
                $('#party_selector').animate({
                    width: $('#party_selector').attr('data-maxwidth'),
                    scrollLeft: 0,
                    'margin-left': 0
                }, 1000, null); 
                $('#party_selector').attr('data-state', 'open');
              }
                
          });
       $('#party_list').append(party_container);
    }
    var max_select_size = Object.keys(parties).length * 121;
    $('#party_selector').css('width', max_select_size + "px");
    $('#party_selector').attr('data-maxwidth', max_select_size);
    $('#party_selector').attr('data-state', 'open');
    // give the internal class enough room to scroll
    $('#party_list').css('width', (max_select_size * 3) + "px");
}


function make_word_list(word_list){
    var max_font_size = 40;
    var word_holder = $("<div></div>", { class:'word_holder' });
    for(var i = 0; i< word_list.length; i++){
        var word_list_obj = $("<div></div>", { 
            class: 'word_list_obj', 
            text: word_list[i]['text'], 
            title: word_list[i]['size']
            })
            .css('color', parties[currentParty]['color'])
            .css('font-size',  Math.round(word_list[i]['size'] / 100 * max_font_size ) + "px")
            .click(function(){
                $('#word').val($(this).text());
            });

        word_holder.append(word_list_obj);
    }
    $("#results_area").append(word_holder);
}

function firstDisplayLogic(data){
    if (firstResultsReturned || data.hasOwnProperty('errors')){
        return;
    }
    else{
        $('#step1').slideUp();
        $('#step2').slideUp();
        var again_button = $("<button id='again_button'>Försök igen!</button>").
            click(function(){
                $('#again_button').fadeOut();
                $('#body_inner').animate({scrollTop:0}, 250, function(){
                     $('#step2').slideDown();
                     $('#step1').slideDown();
                });
            });
        $('#results_area').after(again_button);
    }
}

// help from http://bl.ocks.org/ericcoopey/6382449
/*
function make_word_cloud(word_list){

       var wc_width = 900;
       var wc_height = 500;
       var max_font_size = 40;

       var draw = function (words) {
           d3.select("#results_area").append("svg")
                .attr("width", wc_width)
                .attr("height", wc_height)
                .attr("class", "wordcloud")
                .append("g")
                .attr("transform", "translate(" + wc_width/2 + "," + wc_height/2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return Math.round(d.size / 100 * max_font_size ) + "px"; })
                .style("fill", function(d, i) { return parties[currentParty]['color'];})
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
            };

    d3.layout.cloud().size([wc_width, wc_height])
            .words(word_list)
            //.rotate(function() { return ~~(Math.random() * 2) * 90; })
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();
} */

function get_results(){
    var word = $('#word').val().toLowerCase();
    $('#word').val(word);
    if(word == ""){
        alert("Skriv ett ord!");
        return;
    }
    if(word.includes(' ')){
        alert("Skriv bara ett ord!");
        return;
    }
    if(currentParty == ""){
        alert("Välj ett parti!");
        return;
    }
    
    var partyLetter = parties[currentParty]['letter'];
    var jq_req = $.ajax( "https://alpha.nimishg.com/sv_politi_api/?party=" + partyLetter + "&word=" + word)
                  .done(function(data) {
                      
                      firstDisplayLogic(data);

                      $('#results_area').empty();

                      if(data.hasOwnProperty('errors')){
                          $('#results_area').append(
                              $('<div class="error_msg">Det finns inte tillräckligt med data för ordet från detta parti. Försök med ett annat ord!</div>')
                          );
                      } else {
                          
                          firstResultsReturned = true;
                          
                          var explain_container = $("<div class='explain_container'> <span id='party_col'>" 
                              + currentParty + "</span> använder ordet <strong>" 
                              + word + "</strong> i samma <span class='context_explain' id='context_explain_main'>kontext</span> som:</div>");

                          $('#results_area').append(explain_container);
                          $('#party_col').css('color', parties[currentParty]['color']);

                          $('#context_explain_main').click(function(){
                              $('#overlay').fadeIn();
                          });

                          make_word_list(data.result);    
                      }
                    });

    $('#results_area').empty();
    $('#results_area').append( "<img src='loading.gif'>" ); 

}

// onready
$(function(){

    createPartySelector();
    
    // mostly show things
    $("#submit").click(function(){
        get_results();
        $('footer').fadeIn();
    });

    
    $('#show_step1').click(function(){
        $('#show_step1').fadeOut();
        $('#step1').fadeIn();
    });
    
    
    $('.party_container').click(function(){
        $('#step2').fadeIn();
    });
   
    $('.context_explain').click(function(){
        $('#overlay').fadeIn();
    });

    $('#close').click(function(){
        $('#overlay').fadeOut();
    });
    
});
