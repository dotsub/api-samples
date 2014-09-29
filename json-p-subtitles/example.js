var dotsubVideoId = "282fbb24-0022-4954-b512-714ab31409df";

var currentState = {
    captions: [],
    time: -1
};
/**
 *  This is an example of fetching and loading metadata and subtitles from Dotsub using our JSON-P API.
 *  In this example we will hardcoded the video ID to '282fbb24-0022-4954-b512-714ab31409df'
 */
$(function() {
    var videoPlayer = $('video');
    videoPlayer.on("loadstart", videoStarted);
    $('#languageSelect').on('change', function(){
        var selected = $("#languageSelect option:selected").attr("value");
        fetchCaptions(selected);
    });
    videoPlayer.on('timeupdate', function(e) {
        findCurrentCaption(e.target.currentTime);
    });
});

/**
 * Called when the video started event is thrown.
 */
function videoStarted() {
    //check dotsub for the language available for this video. Script tag calls back to 'loadMetadata'
    var mediaMetadata = "https://dotsub.com/media/"+dotsubVideoId+"/md/js-metadata?callback=loadMetadata";
    appendScriptTag(mediaMetadata);
}

/**
 * Called to load a new set of captions from the server. Data is processed in loadCaptions
 */
function fetchCaptions(language) {
    var subs = "https://dotsub.com/media/"+ dotsubVideoId +"/c/"+language+"/js?callback=loadCaptions";
    appendScriptTag(subs);
}

/**
 * Called when dotsub returns a metadata object. This object is processed and available languages are added to the select.
 * @param metadata
 */
function loadMetadata(metadata) {
    console.log(metadata);
    var languageSelect = $('#languageSelect');
    //iterate the languages in the metadata
    for(var l in metadata.languages) {
        //add this as an option to the select box
        var option = "<option value='" + l + "'> " + metadata.languages[l].languageName + "</option>";
        $(option).appendTo(languageSelect);
    }
    //load english captions
    fetchCaptions("eng");
}

/**
 * Captions are just added as a local array. The lookup to show the current caption is in 'findCurrentCaption'
 * @param captions
 */
function loadCaptions(captions) {
    currentState.captions = captions;
}

/**
 * A function to find the subtitle that should be currently shown. This is a simple liner search.
 * Dotsub's developer test contains a question to create a log(n) search so I'm not including the answer here!
 *
 * @param videoTime the current time of the video in seconds.
 */

function findCurrentCaption(videoTime) {
    //video time returned from the player is in seconds. The time from dotsub is in milliseconds
    videoTime = videoTime * 1000;
    var found = false;
    $.each(currentState.captions,(function(index, item){
        if(item.startTime <= videoTime && (item.startTime + item.duration) > videoTime) {
            $("#subtitleArea").html(item.content);
            found = true;
        }
    }));
    if(!found) {
        $("#subtitleArea").html("");
    }
}

/**
 * Util function to add a script tag to the current page.
 * @param src The src URL for the script tag
 */
function appendScriptTag(src) {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = src;
    headID.appendChild(newScript);
}