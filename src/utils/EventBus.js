
var eventListenerContainer = [];

window.OMG_LI_getEventListenerContainer = function(){
    return eventListenerContainer;
};

function isHasListener(eventName, listener){
    for (var i = 0; i < eventListenerContainer.length; i++) {
        var m = eventListenerContainer[i];
        if (m.eventName === eventName && m.listener===listener) {
            return true;
        }
    }
    return false;
}

export const EventBus = {

    on: function (eventName, listener) {

        //去重
        if (isHasListener(eventName, listener)) {
            return;
        }

        eventListenerContainer.push({
            eventName: eventName,
            listener: listener
        });

    },

    off: function (eventName, listener) {
        var result = [];
        for (var i = 0; i < eventListenerContainer.length; i++) {
            var m = eventListenerContainer[i];
            if (m.eventName === eventName && m.listener === listener) {
                //skip
            } else {
                result.push(m);
            }
        }
        eventListenerContainer = result;
    },

    emit: function (eventName, m1, m2, m3, m4, m5) {
        setTimeout(function () {
            for (var i = 0; i < eventListenerContainer.length; i++) {
                var m = eventListenerContainer[i];
                if (m.eventName === eventName && m.listener) {
                    m.listener(m1, m2, m3, m4, m5);
                }
            }
        }, 1);
    }

};