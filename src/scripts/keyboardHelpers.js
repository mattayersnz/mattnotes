
export function listenerEnter(isAction, eventAction, eventCancel) {
    isAction && document.addEventListener('keydown', (event) => keyDownHandler(event, eventAction, eventCancel));
}

function keyDownHandler(event, eventAction, eventCancel) {
    event.preventDefault();
    console.log(event.keyCode )
    if (event.keyCode === 13) {
        console.log('is this the button')
        eventAction();
        window.removeEventListener("keydown", keyDownHandler);
    }
    else if (event.keyCode === 27) {
        eventCancel();
        window.removeEventListener("keydown", keyDownHandler);
    }
    
};

 