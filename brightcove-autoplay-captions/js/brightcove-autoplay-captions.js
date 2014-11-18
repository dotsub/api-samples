(function() {
    function onPlayerReady() {
        var captionsModule = player.getModule(brightcove.api.modules.APIModules.CAPTIONS);
        captionsModule.setCaptionsEnabled(true);
    }

    var experience = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
    if (experience.getReady()) {
        onPlayerReady();
    } else {
        experience.addEventListener(brightcove.player.events.ExperienceEvent.TEMPLATE_READY, onPlayerReady);
    }
}());