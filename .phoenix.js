// Configuration for https://github.com/sdegutis/Phoenix

lookOfDisapproval = "ツ";
rageOfDongers = "ツ";
whyLook = "ツ";

// Focus window by direction

LEFT = "focus_window_left";
RIGHT = "focus_window_right";
UP = "focus_window_up";
DOWN = "focus_window_down";

isLeft = 0;
isRight = 0;
isTop = 0;
isBottom = 0;

function focus(dir) {
    var win = Window.focusedWindow();
    if (win) {
        if (dir == LEFT) win.focusWindowLeft();
        else if (dir == RIGHT) win.focusWindowRight();
        else if (dir == UP) win.focusWindowUp();
        else if (dir == DOWN) win.focusWindowDown();
    }
}

// Adjust window size and position (according to grid)
function to_left(fill, max) {
    var win = Window.focusedWindow();
    var currentScreen = win.screen();

    if (isLeft) {
        move_to_screen(win, currentScreen.previousScreen());
        // left_one_monitor();
        // to_right(fill, max);
        isLeft = 0;
    } else {

        if (win) {
            var frame = win.frame();
            var screenFrame = win.screen().frameWithoutDockOrMenu();
            frame.y = screenFrame.y;
            frame.x = screenFrame.x;
            frame.height = screenFrame.height;
            frame.width = screenFrame.width * (fill / max);
            win.setFrame(frame);

            isLeft = 1;
        }
    }
}

function to_right(fill, max) {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var screenFrame = win.screen().frameWithoutDockOrMenu();
        frame.y = screenFrame.y;
        frame.x = screenFrame.x + screenFrame.width * (fill / max);
        frame.height = screenFrame.height;
        frame.width = screenFrame.width * (1 - fill / max);
        win.setFrame(frame);
    }
}

function to_top(fill, max) {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var screenFrame = win.screen().frameWithoutDockOrMenu();
        frame.y = screenFrame.y;
        frame.x = screenFrame.x;
        frame.height = screenFrame.height * (fill / max);
        frame.width = screenFrame.width;
        win.setFrame(frame);
    }
}

function to_bottom(fill, max) {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var screenFrame = win.screen().frameWithoutDockOrMenu();
        frame.y = screenFrame.y + screenFrame.height * (fill / max);
        frame.x = screenFrame.x;
        frame.height = screenFrame.height * (1 - fill / max);
        frame.width = screenFrame.width;
        win.setFrame(frame);
    }
}

function to_top_left(fill, max) {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var screenFrame = win.screen().frameWithoutDockOrMenu();
        frame.y = screenFrame.y;
        frame.x = screenFrame.x;
        frame.height = screenFrame.height * (fill / max);
        frame.width = screenFrame.width * (fill / max);
        win.setFrame(frame);
    }
}

function to_top_right(fill, max) {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var screenFrame = win.screen().frameWithoutDockOrMenu();
        frame.y = screenFrame.y;
        frame.x = screenFrame.x + screenFrame.width * (fill / max);
        frame.height = screenFrame.height * (fill / max);
        frame.width = screenFrame.width * (1 - fill / max);
        win.setFrame(frame);
    }
}

function to_bottom_left(fill, max) {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var screenFrame = win.screen().frameWithoutDockOrMenu();
        frame.y = screenFrame.y + screenFrame.height * (fill / max);
        frame.x = screenFrame.x;
        frame.height = screenFrame.height * (1 - fill / max);
        frame.width = screenFrame.width * (1 - fill / max);
        win.setFrame(frame);
    }
}

function to_bottom_right(fill, max) {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var screenFrame = win.screen().frameWithoutDockOrMenu();
        frame.y = screenFrame.y + screenFrame.height * (fill / max);
        frame.x = screenFrame.x + screenFrame.width * (fill / max);
        frame.height = screenFrame.height * (1 - fill / max);
        frame.width = screenFrame.width * (1 - fill / max);
        win.setFrame(frame);
    }
}

function full_screen() {
    var win = Window.focusedWindow();
    if (win) {
        var screenFrame = Window.focusedWindow().screen().frameWithoutDockOrMenu();
        win.setFrame(screenFrame);
    }
}

function calcToScreen(win, newScreen) {
    if (!newScreen)
        return;

    var frame = win.frame();
    var oldScreenRect = win.screen().frameWithoutDockOrMenu();
    var newScreenRect = newScreen.frameWithoutDockOrMenu();

    var xRatio = newScreenRect.width / oldScreenRect.width;
    var yRatio = newScreenRect.height / oldScreenRect.height;

    var x = (Math.round(frame.x - oldScreenRect.x) * xRatio) + newScreenRect.x;
    var y = (Math.round(frame.y - oldScreenRect.y) * yRatio) + newScreenRect.y;
    var w = Math.round(frame.width * xRatio);
    var h = Math.round(frame.height * yRatio);

    // win.setFrame({});
    return {
        x: x,
        y: y,
        width: w,
        height: h
    };
}

// Move windows between monitors
function move_to_screen(win, screen) {
    if (!screen)
        return;

    var frame = win.frame();
    var oldScreenRect = win.screen().frameWithoutDockOrMenu();
    var newScreenRect = screen.frameWithoutDockOrMenu();

    var xRatio = newScreenRect.width / oldScreenRect.width;
    var yRatio = newScreenRect.height / oldScreenRect.height;

    var x = (Math.round(frame.x - oldScreenRect.x) * xRatio) + newScreenRect.x;
    var y = (Math.round(frame.y - oldScreenRect.y) * yRatio) + newScreenRect.y;
    var w = Math.round(frame.width * xRatio);
    var h = Math.round(frame.height * yRatio);

    win.setFrame({
        x: x,
        y: y,
        width: w,
        height: h
    });
}

function circular_lookup(array, index) {
    if (index < 0)
        return array[array.length + (index % array.length)];
    return array[index % array.length];
}

function rotate_monitors(offset) {
    var win = Window.focusedWindow();
    var currentScreen = win.screen();
    var screens = [currentScreen];
    for (var x = currentScreen.previousScreen(); x != win.screen(); x = x.previousScreen()) {
        screens.push(x);
    }
    screens = _(screens).sortBy(function(s) {
        return s.frameWithoutDockOrMenu().x;
    });
    var currentIndex = _(screens).indexOf(currentScreen);
    move_to_screen(win, circular_lookup(screens, currentIndex + offset));
}

function left_one_monitor() {
    rotate_monitors(-1);
}

function right_one_monitor() {
    rotate_monitors(1);
}

// Start/select apps
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
        api.alert(rageOfDongers + " Starting " + title);
        api.launch(title)
        return;
    }
};

// Key combinations
var hyper = ['ctrl', 'alt', 'cmd', 'shift'];
var mash = ['ctrl', 'alt', 'cmd'];
var oppose = ['shift', 'cmd'];

function move(x, y, w, h, screen) {
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
        // return frame;
    }
}

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


function moveLeft() {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var newScreen = win.screen().previousScreen();
        var currentScreen = win.screen();

        if (isAlreadyAt(0, 0, 0, 1, currentScreen) === true) {
            move(1, 0, 0, 1, newScreen);
        } else {
            move(0, 0, 0, 1, currentScreen);
        }
        return frame;
    }
}

function moveLeftUp() {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var newScreen = win.screen().previousScreen();
        var currentScreen = win.screen();

        if (isAlreadyAt(0, 0, 0, 0, currentScreen) === true) {
            move(1, 0, 0, 0, newScreen);
        } else {
            move(0, 0, 0, 0, currentScreen);
        }
        return frame;
    }
}

function moveLeftDown() {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var newScreen = win.screen().previousScreen();
        var currentScreen = win.screen();

        if (isAlreadyAt(0, 1, 0, 0, currentScreen) === true) {
            move(1, 1, 0, 0, newScreen);
        } else {
            move(0, 1, 0, 0, currentScreen);
        }
        return frame;
    }
}

function moveRight() {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var newScreen = win.screen().nextScreen();
        var currentScreen = win.screen();

        if (isAlreadyAt(1, 0, 0, 1, currentScreen) === true) {
            api.alert("move right monitor");
            move(0, 0, 0, 1, newScreen);
        } else {
            move(1, 0, 0, 1, currentScreen);
        }
        return frame;
    }
}

function moveRightUp() {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var newScreen = win.screen().nextScreen();
        var currentScreen = win.screen();

        if (isAlreadyAt(1, 0, 0, 0, currentScreen) === true) {
            move(0, 0, 0, 0, newScreen);
        } else {
            move(1, 0, 0, 0, currentScreen);
        }
        return frame;
    }
}

function moveRightDown() {
    var win = Window.focusedWindow();
    if (win) {
        var frame = win.frame();
        var newScreen = win.screen().nextScreen();
        var currentScreen = win.screen();

        if (isAlreadyAt(1, 1, 0, 0, currentScreen) === true) {
            move(0, 1, 0, 0, newScreen);
        } else {
            move(1, 1, 0, 0, currentScreen);
        }
        return frame;
    }
}

// Screen placement movement
api.bind('h', mash, function() {
    moveLeft();
});
api.bind('y', mash, function() {
    moveLeftUp();
});
api.bind('n', mash, function() {
    moveLeftDown();
});
api.bind('l', mash, function() {
    moveRight();
});
api.bind('p', mash, function() {
    moveRightUp();
});
api.bind('.', mash, function() {
    moveRightDown();
});

// Monitor movement
api.bind('u', mash, left_one_monitor);
api.bind('o', mash, right_one_monitor);

// Full screen
api.bind('i', mash, full_screen);

// Focus
api.bind('h', hyper, function() {
    focus(LEFT);
});
api.bind('l', hyper, function() {
    focus(RIGHT);
});
api.bind('k', hyper, function() {
    focus(UP);
});
api.bind('j', hyper, function() {
    focus(DOWN);
});

// Launcher
api.bind('f5', ['cmd'], function() {
    App.focusOrStart('path finder');
});
api.bind('f9', ['cmd'], function() {
    App.focusOrStart('emacs');
});
api.bind('f10', ['cmd'], function() {
    App.focusOrStart('iterm');
});
api.bind('f11', ['shift', 'cmd'], function() {
    App.focusOrStart('google chrome canary');
});
api.bind('f11', ['cmd'], function() {
    App.focusOrStart('google chrome');
});
