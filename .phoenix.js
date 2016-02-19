// Constants.
var FULL = 0;
var LEFT = 1;
var RIGHT = 2;

// Hotkeys.
var keys = [];

// Key combinations.
var mash = ['ctrl', 'alt', 'cmd'];
var cmd = ['cmd'];

function alert(message) {
    var modal = new Modal();
    modal.message = message;
    modal.duration = 1;
    modal.show();
}

function computeNewFrameFromGrid(screen, grid) {
    var screenRect = screen.visibleFrameInRectangle();
    if (!screenRect) {
        return;
    }

    var unitX = screenRect.width / 2;
    var unitY = screenRect.height / 2;

    var newFrame = {
        x: screenRect.x + (grid.x * unitX),
        y: screenRect.y + (grid.y * unitY),
        width: grid.width * unitX,
        height: grid.height * unitY,
    };

    return newFrame;
}

function isAtGrid(grid) {
    var win = Window.focusedWindow();
    if (!win) {
        return;
    }

    var newFrame = computeNewFrameFromGrid(win.screen(), grid);

    if (win.topLeft().x !== newFrame.x) {
        return false;
    }

    if (win.size().width - newFrame.width > 20) {
        return false;
    }

    if (Math.abs(win.size().height - newFrame.height) > 20) {
        return false;
    }
    return true;
}

function moveToGrid(screen, grid) {
    var win = Window.focusedWindow();
    if (!win) {
        return;
    }

    var newFrame = computeNewFrameFromGrid(screen, grid);
    win.setFrame(newFrame);
}

function move(win, newGrid, direction) {
    // Full screen.
    if (direction === FULL) {
        moveToGrid(win.screen(), newGrid);
        return;
    }

    // Move to the new location.
    if (!isAtGrid(newGrid)) {
        moveToGrid(win.screen(), newGrid);
        return;
    }

    // Need to move screens.
    // Flip the 'x' location so that we move by screen halves.
    newGrid.x = 1 - newGrid.x;
    if (direction === LEFT) {
        moveToGrid(win.screen().next(), newGrid);
    } else {
        moveToGrid(win.screen().previous(), newGrid);
    }
}

/* Window movement */

// Maximize.
keys.push(Phoenix.bind('i', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:0, y:0, width:2, height:2}, FULL);
}));

// Left half.
keys.push(Phoenix.bind('h', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:0, y:0, width:1, height:2}, LEFT);
}));

// Right half.
keys.push(Phoenix.bind('l', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:1, y:0, width:1, height:2}, RIGHT);
}));

// Top-left.
keys.push(Phoenix.bind('y', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:0, y:0, width:1, height:1}, LEFT);
}));
keys.push(Phoenix.bind('u', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:0, y:0, width:1, height:1}, LEFT);
}));

// Top-right.
keys.push(Phoenix.bind('p', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:1, y:0, width:1, height:1}, RIGHT);
}));
keys.push(Phoenix.bind('[', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:1, y:0, width:1, height:1}, RIGHT);
}));

// Bottom-left.
keys.push(Phoenix.bind('n', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:0, y:1, width:1, height:1}, LEFT);
}));
keys.push(Phoenix.bind('b', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:0, y:1, width:1, height:1}, LEFT);
}));

// Bottom-right.
keys.push(Phoenix.bind('.', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:1, y:1, width:1, height:1}, RIGHT);
}));
keys.push(Phoenix.bind('/', mash, function() {
    var win = Window.focusedWindow();
    move(win, {x:1, y:1, width:1, height:1}, RIGHT);
}));


/* Hotkeys */

function appLauncher(appName) {
    return function() {
        var app = App.launch(appName);
        app.focus();

        alert(appName);
    };
}

keys.push(Phoenix.bind('f5', cmd, appLauncher('path finder')));
keys.push(Phoenix.bind('f8', cmd, appLauncher('gitup')));
keys.push(Phoenix.bind('f9', cmd, appLauncher('sublime text')));
keys.push(Phoenix.bind('f10', cmd, appLauncher('iterm')));
keys.push(Phoenix.bind('f11', cmd, appLauncher('google chrome')));
keys.push(Phoenix.bind('f12', cmd, appLauncher('google chrome canary')));
