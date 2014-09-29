$(function() {
    var videoPlayer = $('video');
    videoPlayer.on("loadstart", function() {
        //after load append the cross origin header. This is required since the subtitles are from a different domain.
        videoPlayer.attr("crossorigin", "anonymous");
        videoPlayer.attr("crossOrigin", "anonymous");
        var track1 = '<track kind="captions" label="English" src="http://dotsub.com/media/282fbb24-0022-4954-b512-714ab31409df/c/eng/vtt" default/>';
        var track2 = '<track kind="subtitles" label="Spanish" src="http://dotsub.com/media/282fbb24-0022-4954-b512-714ab31409df/c/spa/vtt"/>';
        videoPlayer.append(track1);
        videoPlayer.append(track2);
    });
});