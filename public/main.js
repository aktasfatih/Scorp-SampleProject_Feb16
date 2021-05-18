// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper(null, null, true);

var gifQueue = new Array();
var messageQueue = new Array();

function olderThan20(event){
    // Hiding messages older than 20 secs
    let timeDif = (new Date().getTime() - event.timestamp.getTime())/1000;
    if(timeDif > 20){
        return true;
    }
    return false;
}

var queueTimer = setInterval(function(){
    // Handling animations
    if(gifQueue.length>0){
        if(!isAnimatingGiftUI()){
            let event = gifQueue.shift();
            addMessage(event);
            animateGift(event);
        }
    }

    // Handling messages and gifts
    if(messageQueue.length > 0){
        let event = messageQueue.shift();
        if(!olderThan20(event)){
            addMessage(event)
        }
    }
    console.log("Showing")
    console.log({gifQueue})
}, 500);

api.setEventHandler((events) => {
    console.log(events);
    events.forEach(event => {
        if((event.type == "ag")){
            gifQueue.push(event);
        }else{
            messageQueue.push(event);
        }
    })
})

// NOTE: UI helper methods from `dom_updates` are already imported above.
