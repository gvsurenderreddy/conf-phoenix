var EMOTICONS = {
    smiley: "ツ",
};

var DIRECTIONS = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
};

var KEY_COMBINATIONS = {
    hyper: ['ctrl', 'alt', 'cmd', 'shift'],
    mash: ['ctrl', 'alt', 'cmd'],
    oppose: ['shift', 'cmd'],
};

// Focus.
function focus(dir) {
    var win = Window.focusedWindow();
    if (win) {
        if (dir == DIRECTIONS.LEFT) win.focusWindowLeft();
        else if (dir == DIRECTIONS.RIGHT) win.focusWindowRight();
        else if (dir == DIRECTIONS.UP) win.focusWindowUp();
        else if (dir == DIRECTIONS.DOWN) win.focusWindowDown();
    }
}

// Start or select applications.
App.allWithTitle = function(title) {
    return _(this.runningApps()).filter(function(app) {
        if (app.title() === title) {
            return true;
        }
    });
};
App.focusOrStart = function(title) {
    var apps = App.allWithTitle(title);
    if (_.isEmpty(apps)) {
        api.alert(EMOTICONS.smiley + " Starting " + title);
        api.launch(title);
        return;
    }
};

function isAlreadyAt(x, y, w, h, screen) {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var screenFrame = screen.frameWithoutDockOrMenu();

        unitHeight = screenFrame.height / 2;
        unitWidth = screenFrame.width / 2;

        if ((frame.x - (screenFrame.x + x * unitWidth)) === 0 &&
            (frame.y - (screenFrame.y + y * unitHeight)) === 0 &&
            (frame.height - (h + 1) * unitHeight) < 10 &&
            (frame.width - (w + 1) * unitWidth) < 10) {
            return true;
        } else {
            return false;
        }
    }
    return null;
}

function setWindowLocation(x, y, w, h, screen) {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var screenFrame = screen.frameWithoutDockOrMenu();

        unitHeight = screenFrame.height / 2;
        unitWidth = screenFrame.width / 2;

        frame.height = (h + 1) * unitHeight;
        frame.width = (w + 1) * unitWidth;
        frame.x = screenFrame.x + x * unitWidth;
        frame.y = screenFrame.y + y * unitHeight;
        win.setFrame(frame);
        return frame;
    }
}

function fullScreen() {
    var win = Window.focusedWindow();
    if (win) {
        var screenFrame = Window.focusedWindow().screen().frameWithoutDockOrMenu();
        win.setFrame(screenFrame);
    }
}

function move(x, y, w, h, direction) {
    var win = Window.focusedWindow();
    if (win) {
        var currentScreen = win.screen();
        if (isAlreadyAt(x, y, w, h, currentScreen)) {
            var nextScreen;
            if (direction === DIRECTIONS.LEFT) {
                nextScreen = currentScreen.nextScreen();
            } else {
                nextScreen = currentScreen.previousScreen();
            }
            setWindowLocation(1-x, y, w, h, nextScreen);
        } else {
            setWindowLocation(x, y, w, h, currentScreen);
        }
    }
}

function moveLeft()      { move(0,0,0,1, DIRECTIONS.LEFT); }
function moveLeftUp()    { move(0,0,0,0, DIRECTIONS.LEFT); }
function moveLeftDown()  { move(0,1,0,0, DIRECTIONS.LEFT); }
function moveRight()     { move(1,0,0,1, DIRECTIONS.RIGHT); }
function moveRightUp()   { move(1,0,0,0, DIRECTIONS.RIGHT); }
function moveRightDown() { move(1,1,0,0, DIRECTIONS.RIGHT); }

// Window movement.
api.bind('h', KEY_COMBINATIONS.mash, function() { moveLeft(); });
api.bind('y', KEY_COMBINATIONS.mash, function() { moveLeftUp(); });
api.bind('u', KEY_COMBINATIONS.mash, function() { moveLeftUp(); });
api.bind('n', KEY_COMBINATIONS.mash, function() { moveLeftDown(); });
api.bind('b', KEY_COMBINATIONS.mash, function() { moveLeftDown(); });
api.bind('l', KEY_COMBINATIONS.mash, function() { moveRight(); });
api.bind('p', KEY_COMBINATIONS.mash, function() { moveRightUp(); });
api.bind('o', KEY_COMBINATIONS.mash, function() { moveRightUp(); });
api.bind('.', KEY_COMBINATIONS.mash, function() { moveRightDown(); });
api.bind('/', KEY_COMBINATIONS.mash, function() { moveRightDown(); });

// Full screen.
api.bind('i', KEY_COMBINATIONS.mash, fullScreen);

// Focus.
api.bind('h', KEY_COMBINATIONS.hyper, function() { focus(DIRECTIONS.LEFT); });
api.bind('l', KEY_COMBINATIONS.hyper, function() { focus(DIRECTIONS.RIGHT); });
api.bind('k', KEY_COMBINATIONS.hyper, function() { focus(DIRECTIONS.UP); });
api.bind('j', KEY_COMBINATIONS.hyper, function() { focus(DIRECTIONS.DOWN); });

// Launcher.
api.bind('f5', ['cmd'], function() { App.focusOrStart('path finder'); });
api.bind('f9', ['cmd'], function() { App.focusOrStart('sublime text'); });
api.bind('f10', ['cmd'], function() { App.focusOrStart('iterm'); });
api.bind('f11', ['shift', 'cmd'], function() { App.focusOrStart('google chrome canary'); });
api.bind('f11', ['cmd'], function() { App.focusOrStart('google chrome'); });
