const Rectangle = require('Rectangle');
const random = require('random');

const {
    FRAME_LENGTH, WIDTH, HEIGHT, EDGE_LENGTH,
} = require('gameConstants');

function getNewState() {
    return {
        actions: {},
        fuel: 100,
        displayFuel: 0,
        camera: {
            left: -WIDTH / 2 + EDGE_LENGTH,
            top: -100,
        },
        rows: {},
        flags: {},
        sfx: {},
        bgm: 'bgm/title.mp3',
        interacted: false,
        time: 0,
        spriteMap: {},
        bombsDiffusedToday: 0,
        bonusFuelToday: 0,
        crystalsCollectedToday: 0,
        saved: {
            range: 1.2,
            maxFuel: 100,
            seed: random.nextSeed(),
            day: 1,
            maxDepth: 1,
            score: 0,
            playedToday: false,
            achievementStats: {},
        },
    };
}

function nextDay(state) {
    return {
        ...state,
        bombsDiffusedToday: 0,
        bonusFuelToday: 0,
        crystalsCollectedToday: 0,
        saved: {
            ...state.saved,
            day: state.saved.day + 1,
            seed: random.nextSeed(state.saved.seed),
            playedToday: false,
        },
        camera: {
            left: -WIDTH / 2 + EDGE_LENGTH,
            top: -100,
        },
        rows: {},
        flags: {},
        fuel: state.saved.maxFuel,
        selected: null,
        shop: state.time,
    };
}

function getOverButton(state, coords = {}) {
    const {x, y} = coords;
    if (!(x >= 0 && x <= WIDTH && y >= 0 && y <= HEIGHT)) return null;
    for (const hudButton of getHUDButtons(state)) {
        if (new Rectangle(hudButton).containsPoint(x, y)) {
            return hudButton;
        }
    }
    return getOverCell(state, {x, y});
}

function setButtonState(state) {
    if (state.mouseDown && state.time - state.mouseDown >= 500) {
        state = {...state, mouseDown: false, rightClicked: true, mouseDownCoords: false};
    } else if (state.mouseDownCoords && !state.mouseDown) {
        const startButton = getOverButton(state, state.mouseDownCoords);
        const lastButton = getOverButton(state, state.lastMouseCoords);
        if (lastButton === startButton ||
            (lastButton.cell && lastButton.row === startButton.row && lastButton.column === startButton.column)
        ) {
            state = {...state, clicked: true};
        }
        state = {...state, mouseDownCoords: false, lastMouseCoords: false};
    }
    if (state.lastMouseCoords) {
        state = {...state, overButton: getOverButton(state, state.lastMouseCoords)};
    }
    return state;
    /*let overButton = null;
    if (!state.mouseCoords) {
        return {...state, overButton};
    }
    let {x, y} = state.mouseCoords;
    if (x < 0 || x > WIDTH || y < 0 || y > HEIGHT) {
        return {...state, overButton};
    }
    for (const hudButton of getHUDButtons(state)) {
        if (new Rectangle(hudButton).containsPoint(x, y)) {
            return {...state, overButton: hudButton};
        }
    }
    return {...state, overButton};*/
}
function advanceState(state) {
    state = setButtonState(state);
    for (const hudButton of getHUDButtons(state)) {
        if (hudButton.advance) {
            state = hudButton.advance(state, hudButton);
        }
    }
    state = advanceAchievements(state);
    if (state.clicked && state.overButton && state.overButton.onClick) {
        state = state.overButton.onClick(state, state.overButton);
    }
    if (!state.showAchievements && !state.shop) {
        state = advanceDigging(state);
    }
    for (let spriteId in state.spriteMap) {
        state = state.spriteMap[spriteId].advance(state, state.spriteMap[spriteId]);
    }
    //camera.top += 1;
    return {...state, time: state.time + FRAME_LENGTH, clicked: false, rightClicked: false};
}

function applyActions(state, actions) {
    state = {...state, actions};
    if (!state.interacted) {
        for (var i in actions) {
            if (actions[i]) return {...state, interacted: true};
        }
    }
    return state
}

module.exports = {
    getNewState,
    advanceState,
    applyActions,
    nextDay,
};

const { getHUDButtons } = require('hud');

const { advanceDigging, getOverCell } = require('digging');

const {
    advanceAchievements,
} = require('achievements');

