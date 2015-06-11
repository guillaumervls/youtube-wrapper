var deferMethod = require('defer-calls').method;
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var PROXIED_YT_METHODS = module.exports.PROXIED_YT_METHODS = [
  'cueVideoById',
  'loadVideoById',
  'cueVideoByUrl',
  'loadVideoByUrl',
  'cuePlaylist',
  'loadPlaylist',
  'playVideo',
  'pauseVideo',
  'stopVideo',
  'seekTo',
  'clearVideo',
  'nextVideo',
  'previousVideo',
  'playVideoAt',
  'mute',
  'unMute',
  'isMuted',
  'setVolume',
  'getVolume',
  'setSize',
  'getPlaybackRate',
  'setPlaybackRate',
  'getAvailablePlaybackRates',
  'setLoop',
  'setShuffle',
  'getVideoLoadedFraction',
  'getPlayerState',
  'getCurrentTime',
  'getVideoStartBytes',
  'getVideoBytesLoaded',
  'getVideoBytesTotal',
  'getPlaybackQuality',
  'setPlaybackQuality',
  'getAvailableQualityLevels',
  'getDuration',
  'getVideoUrl',
  'getVideoEmbedCode',
  'getPlaylist',
  'getPlaylistIndex',
  'getIframe',
  'destroy'
];

var PROXIED_YT_EVENTS = module.exports.PROXIED_YT_EVENTS = [
  'onStateChange',
  'onReady',
  'onError',
  'onPlaybackQualityChange',
  'onPlaybackRateChange',
  'onApiChange',
];

var asyncYTPlayerFactory = {
  build: function (element, opts, cb) {
    cb(null, new window.YT.Player(element, opts));
  }
};
var ytBuilds = deferMethod(asyncYTPlayerFactory, 'build');

var Player = module.exports.Player = function (element, opts) {
  EventEmitter.call(this);
  var events = {};
  var that = this;
  PROXIED_YT_EVENTS.forEach(function (eventName) {
    events[eventName] = function (e) {
      that.emit(eventName, e);
    };
  });
  var deferedYTCalls = deferMethod(this, 'applyYTMethod');
  asyncYTPlayerFactory.build(element, {
    width: opts.width,
    height: opts.height,
    videoId: opts.videoId,
    playerVars: opts.playerVars,
    events: events
  }, function (err, player) {
    that._ytPlayer = player;
  });
  this.once('onReady', function () {
    deferedYTCalls.execAll();
  });
};

inherits(Player, EventEmitter);

Player.prototype.applyYTMethod = function (methodName, args) {
  this._ytPlayer[methodName].apply(this._ytPlayer, args);
};

var proxyYTMethod = module.exports.proxyYTMethod = function (methodName) {
  Player.prototype[methodName] = function () {
    return this.applyYTMethod(methodName, arguments);
  };
};

PROXIED_YT_METHODS.forEach(proxyYTMethod);

var youTubeAPIReady = module.exports.youTubeAPIReady = function () {
  ytBuilds.execAll();
};

module.exports.autoLoadYouTubeAPI = function () {
  // Load YouTube API asynchronously
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function () {
    youTubeAPIReady();
    delete window.onYouTubeIframeAPIReady;
  };
};
