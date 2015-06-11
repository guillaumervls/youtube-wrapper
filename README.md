# YouTube Wrapper

*A simpler way to load YouTube players.*

For use with [Browserify](http://browserify.org/)

## Install

`npm i youtube-wrapper`

## Use

```javascript
var youTube = require('youtube-wrapper');

// Call this **once** in our app to automatically load the YouTube API
youTube.autoLoadYouTubeAPI();

// -- OR --

// Load it yourself and call (usually in window.onYouTubeIframeAPIReady):
youTube.youTubeAPIReady();

// Anyway, you can immediately do :
var Player = youTube.Player;
var player = new Player(element, opts);
// element and opts are the same as in the YouTube API

player.play(); // No need to wait for the onReady event !
```

### NB :

`opts` doesn't accept the `events` key. Instead `Player` inherits from Node's [`EventEmitter`](https://nodejs.org/api/events.html#events_class_events_eventemitter).

Available events and methods are listed in `youTube.PROXIED_YT_EVENTS` and `youTube.PROXIED_YT_METHODS`.

If YouTube add some events before an update of this module you can add them to `youTube.PROXIED_YT_EVENTS`.

If YouTube add some methods before an update of this module you can add them with `youTube.proxyYTMethod('methodName')`.
Or you can use `player.applyYTMethod('methodName', [args])``

## License

MIT
