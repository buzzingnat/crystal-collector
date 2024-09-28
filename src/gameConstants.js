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
//const scale = 2;
//canvas.style.transformOrigin = '0 0'; //scale from top left
//canvas.style.transform = 'scale(' + scale + ')';
canvas.scale = 1;
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;
document.body.appendChild(canvas);

const MENU_BAR_HEIGHT = 32;

let menuBar;
if (window.electronAPI) {
    menuBar = document.createElement('div');
    //menuBar.style.width = window.outerWidth;
    menuBar.style.left = '0px';
    menuBar.style.right = '0px';
    menuBar.style.height = `${MENU_BAR_HEIGHT}px`;
    menuBar.style.position = 'fixed';
    menuBar.style.zIndex = '1000';
    menuBar.style.top = '0px';
    menuBar.style.background = '#888';
    menuBar.style.borderBottom = '1px #333 solid';
    menuBar.style.boxSizing = 'border-box';
    // turn on dragging for menuBar element
    menuBar.style['-webkit-app-region'] = 'drag';
    document.body.insertBefore(menuBar, document.body.children[0]);

    // turn off dragging for canvas element if inside of the electron app
    canvas.style['-webkit-app-region'] = 'no-drag';
}

module.exports = {
    canvas,
    context,
    menuBar,
    FRAME_LENGTH: 20,
    EDGE_LENGTH,
    COLUMN_WIDTH,
    ROW_HEIGHT,
    SHORT_EDGE,
    LONG_EDGE,
    COLOR_GOOD,
    COLOR_BAD,
    COLOR_CRYSTAL,
    MENU_BAR_HEIGHT,
};
