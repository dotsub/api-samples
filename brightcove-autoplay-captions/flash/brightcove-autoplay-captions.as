package {

import com.brightcove.api.APIModules;
import com.brightcove.api.CustomModule;
import com.brightcove.api.modules.CaptionsModule;

/**
 * A Brightcove plugin that auto loads captions.
 */
public class CaptionConfigurationModule extends CustomModule {

    override protected function initialize():void {
        var captionModule:CaptionsModule = player.getModule(APIModules.CAPTIONS) as CaptionsModule;
        captionModule.setCaptionsEnabled(true);
    }
}
}