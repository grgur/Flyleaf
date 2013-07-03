/**
 * Tap event is uniform for click on desktop and touch on touchscreen
 */
if (typeof global.ontouchstart === "object") {
    onTouchEnd = function (ev) {
        var endTarget = ev.target,
            start = ev.data,
            end = ev.originalEvent.changedTouches[0],
            timeStamp = ev.timeStamp,
            startTarget = start.startTarget,

            speed = timeStamp - start.timeStamp,
            horiz = end.pageX - start.pageX,
            vert = end.pageY - start.pageY,

            deltaHoriz = Math.abs(horiz),
            deltaVert = Math.abs(vert),

            swipe = deltaHoriz > 10 || deltaVert > 10,

            direction = deltaHoriz > deltaVert ? (horiz > 0 ? 'right ' : 'left') : (vert > 0 ? 'down' : 'up');

        if (startTarget === endTarget) {
            if (swipe) {
                $(endTarget).trigger('swipe', [ev, direction, speed, horiz, vert, endTarget]);
            } else if (speed > 200 && speed < 1000) {
                $(endTarget).trigger('longtap', [ev, speed, endTarget]);
            } else if (speed < 200) {
                $(endTarget).trigger('tap', [ev, endTarget]);
            }
//            ev.stopPropagation();
//            ev.preventDefault();
        }
    };

    doc.on('touchstart', function (ev) {
        var touch = ev.originalEvent.touches[0];
        doc.one('touchend', {
            startTarget : ev.target,
            startTouch  : touch,
            pageX       : touch.pageX,
            pageY       : touch.pageY,
            timeStamp   : ev.timeStamp
        }, onTouchEnd);
    });
} else {
    doc.on('click', function (ev) {
        var target = ev.target;
        $(target).trigger('tap', [ev, target]);
    });
}