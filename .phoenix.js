// Configuration for https://github.com/sdegutis/Phoenix

lookOfDisapproval = "";
rageOfDongers = "";
whyLook = "";

lookOfDisapproval = "ツ¯";
rageOfDongers = "ツ";
whyLook = "ツ";

// Focus window by direction

LEFT     = "focus_window_left";
RIGHT    = "focus_window_right";
UP       = "focus_window_up";
DOWN     = "focus_window_down";

function focus(dir) {
     var win = Window.focusedWindow();
     if (win) {
          if      (dir == LEFT)  win.focusWindowLeft();
          else if (dir == RIGHT) win.focusWindowRight();
          else if (dir == UP)    win.focusWindowUp();
          else if (dir == DOWN)  win.focusWindowDown();
     }
}

// Adjust window size and position (according to grid)
function to_left(fill, max) {
     var win = Window.focusedWindow();
     if (win) {
          var frame = win.frame();
          var screenFrame = win.screen().frameWithoutDockOrMenu();
          frame.y = screenFrame.y;
          frame.x = screenFrame.x;
          frame.height = screenFrame.height;
          frame.width = screenFrame.width * (fill / max);
          win.setFrame(frame);
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

// Move windows between monitors
function move_to_screen(win, screen) {
     if (!screen)
          return;

     var frame = win.frame();
     var oldScreenRect = win.screen().frameWithoutDockOrMenu();
     var newScreenRect = screen.frameWithoutDockOrMenu();

     var xRatio = newScreenRect.width / oldScreenRect.width;
     var yRatio = newScreenRect.height / oldScreenRect.height;

     win.setFrame({
          x: (Math.round(frame.x - oldScreenRect.x) * xRatio) + newScreenRect.x,
          y: (Math.round(frame.y - oldScreenRect.y) * yRatio) + newScreenRect.y,
          width: Math.round(frame.width * xRatio),
          height: Math.round(frame.height * yRatio)
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
     screens = _(screens).sortBy(function(s) { return s.frameWithoutDockOrMenu().x; });
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
App.allWithTitle = function( title ) {
     return _(this.runningApps()).filter( function( app ) {
          if (app.title() === title) {
               return true;
          }
     });
};

App.focusOrStart = function ( title ) {
     var apps = App.allWithTitle( title );
     if (_.isEmpty(apps)) {
          api.alert(rageOfDongers + " Starting " + title);
          api.launch(title)
          return;
     }

     var windows = _.chain(apps)
         .map(function(x) { return x.allWindows(); })
         .flatten()
         .value();

     activeWindows = _(windows).reject(function(win) { return win.isWindowMinimized();});
     if (_.isEmpty(activeWindows)) {
          api.alert(whyLook +" All windows minimized for " + title);
          return;
     }

     activeWindows.forEach(function(win) {
          win.focusWindow();
     });
};

// Key combinations
var hyper = ['ctrl','alt','cmd','shift'];
var mash  = ['ctrl','alt','cmd'];
var oppose  = ['shift','cmd'];

// Screen placement movement
api.bind('h', mash, function() { to_left(1, 2); });          // left
api.bind('l', mash, function() { to_right(1, 2); });         // right
api.bind('k', mash, function() { to_top(1, 2); });           // up
api.bind('j', mash, function() { to_bottom(1, 2); });        // down
api.bind('.', mash, function() { to_bottom_right(1, 2); });  // bottom-right
api.bind('n', mash, function() { to_bottom_left(1, 2); });   // bottom-left
api.bind('p', mash, function() { to_top_right(1, 2); });     // top-right
api.bind('y', mash, function() { to_top_left(1, 2); });      // top-left

// Monitor movement
api.bind('u', mash, left_one_monitor);
api.bind('o', mash, right_one_monitor);

// Full screen
api.bind('i', mash, full_screen);

// Focus
api.bind('h', hyper, function() {focus(LEFT);});
api.bind('l', hyper, function() {focus(RIGHT);});
api.bind('k', hyper, function() {focus(UP);});
api.bind('j', hyper, function() {focus(DOWN);});

// Launcher
api.bind('e',   ['cmd'], function() {App.focusOrStart('forklift');});
api.bind('f9',  ['cmd'], function() {App.focusOrStart('emacs');});
api.bind('f10', ['cmd'], function() {App.focusOrStart('iterm');});
api.bind('f11', ['shift', 'cmd'], function() {App.focusOrStart('google chrome canary');});
api.bind('f11', ['cmd'], function() {App.focusOrStart('google chrome');});
api.bind('f12', ['cmd'], function() {App.focusOrStart('notes');});
api.bind('f', ['ctrl', 'shift', 'cmd'], function() {App.focusOrStart('evernote');});

