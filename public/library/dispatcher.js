const dispatcher = {};
const target = new EventTarget();

dispatcher.on = function(name = "", callback = null) {

    if(name.length > 0 && callback !== null) {
        target.addEventListener(name, (event) => { callback(event, event.detail) }, true);
    };

};

dispatcher.call = function(name = "", argument = null) {

    if(name.length > 0) {
        target.dispatchEvent(new CustomEvent(name, { detail: argument }));
    };

};


export default dispatcher;