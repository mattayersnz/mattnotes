
export function listenerEnter(isAction, eventAction) {
    document.addEventListener('keydown', function (event) {
        if (isAction)  {
            event.preventDefault();
            if (event.keyCode === 13) {
                eventAction();
            }
        }
    });
}

 