
export function listenerEnter(isAction, eventAction, eventCancel) {
    isAction && document.addEventListener('keydown', (event) => keyDownHandler(event, eventAction, eventCancel));
}

function keyDownHandler(event, eventAction, eventCancel) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.removeEventListener("keydown", keyDownHandler, true);
        eventAction();
    }
    else if (event.keyCode === 27) {
        document.removeEventListener("keydown", keyDownHandler, true);
        eventCancel();
    }
    
};

 