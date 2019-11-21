const EDGE_LENGTH = 50;
const LONG_EDGE = 43.5;
const SHORT_EDGE = EDGE_LENGTH / 2;
const COLUMN_WIDTH = EDGE_LENGTH + SHORT_EDGE;
const ROW_HEIGHT = LONG_EDGE * 2;
const COLOR_GOOD = '#33c446';
const COLOR_BAD = '#c44e33';
const COLOR_CRYSTAL = '#58bf9f';

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 550;
const context = canvas.getContext('2d');
document.body.appendChild(canvas);

module.exports = {
    canvas,
    context,
    FRAME_LENGTH: 20,
    EDGE_LENGTH,
    COLUMN_WIDTH,
    ROW_HEIGHT,
    SHORT_EDGE,
    LONG_EDGE,
    COLOR_GOOD,
    COLOR_BAD,
    COLOR_CRYSTAL,
};
