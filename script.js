data = [
    {uid: "111", since: 10, till: 20, y: 10, hl: false},
    {uid: "222", since: 15, till: 25, y: 20, hl: false},
    {uid: "333", since: 20, till: 35, y: 30, hl: false, ref: ["111",]},
];

dx = 0;
dy = 0;
xscale = 5.0;
yscale = 5.0;
height = 7;
dragging_r = false;
dragging_l = false;
dragx = 0;
dragy = 0;
dragx0 = 0;
dragy0 = 0;


function transform_element(el){
    return {
        x: (el.since + dx) * xscale,
        w: ((el.till - el.since)) * xscale,
        y: (el.y + dy) * yscale,
        h: height * yscale,
    }
}

function is_inside(el, x, y){
    var p = transform_element(el);
    return (x > p.x && x < (p.x + p.w) && y > p.y && y < (p.y + p.h));
}


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < 3; i++){

        var el = data[i];
        if (el.hl){
            ctx.fillStyle = 'rgb(255, 0, 0)';
        } else {
            ctx.fillStyle = 'rgb(0, 255, 0)';
        }
        var el_t = transform_element(el);
        ctx.fillRect(el_t.x, el_t.y, el_t.w, el_t.h);

    }

}
function init(){
    canvas = document.getElementById('the_div');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    }
    draw();
    canvas.oncontextmenu = function(ev){return false;};
    canvas.onclick = function(ev){
        var x = ev.offsetX;
        var y = ev.offsetY;
        for (var i = 0; i < 3; i++){
            if (is_inside(data[i], x, y)){
                data[i].hl = ! data[i].hl;
                draw();
                return false;
            }
        }
        return false;
    }
    canvas.onmousedown = function(ev){
        if (ev.button === 2){
            dragging_r = true;
        }
        if (ev.button === 0){
            dragging_l = true;
        }
        dragx = ev.offsetX;
        dragy = ev.offsetY;
        dragx0 = ev.offsetX;
        dragy0 = ev.offsetY;
        return false;
    };
    canvas.onmouseup = function(ev){
        dragging_r = false;
        dragging_l = false;
    };
    canvas.onmousemove = function (ev){
        if (dragging_r || dragging_l){
            console.log("drag", ev);
            var x = ev.offsetX;
            var y = ev.offsetY;
            ddragx = x - dragx;
            ddragy = y - dragy;
            dragx = ev.offsetX;
            dragy = ev.offsetY;
            if (dragging_r){
                // point in the graph coordinates
                var offx = dragx0 / xscale - dx;
                var offy = dragy0 / yscale - dy;

                xscale += ddragx * 0.1;
                yscale += ddragy * 0.1;

                if (xscale < 1) xscale = 1;
                if (yscale < 1) yscale = 1;

                dx = dragx0 / xscale - offx;
                dy = dragy0 / yscale - offy;
            }
            else
            {
                dx += ddragx / xscale;
                dy += ddragy / yscale;
            }
            draw();
        }
    }
};
