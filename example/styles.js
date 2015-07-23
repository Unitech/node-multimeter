var multimeter = require('multimeter');
var multi = multimeter(process);
multi.on('^C', process.exit);

var bars = [];
var progress = [];
var deltas = [];

multi.write('Progress:\n\n');

var barcount=0;
for (var styleName in multi.styles)
  createBar(styleName, multi.styles[styleName]);

function createBar(text, style){

    var idx=++barcount;

    multi.write('   '+ text+': \n');

    var bar = multi.rel(20, Object.keys(multi.styles).length-idx, style);
    bars.push(bar);

    deltas.push(1 + Math.random() * 9);
    progress.push(0);
}

multi.offset += 2;
multi.write('\nbeep');

setTimeout(function () {
    multi.offset ++;
    multi.write('\n    boop');
}, 2000);

var pending = progress.length;
var iv = setInterval(function () {
    progress.forEach(function (p, i) {
        progress[i] += Math.random() * deltas[i];
        bars[i].percent(progress[i]);
        if (p < 100 && progress[i] >= 100) pending --;
        if (pending === 0) {
            multi.write('\nAll done.\n');
            multi.destroy();
            clearInterval(iv);
            pending --;
        }
    });
}, 100);
