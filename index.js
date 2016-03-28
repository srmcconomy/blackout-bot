var irc = require('irc');
var client = new irc.Client('irc.speedrunslive.com', 'BlackoutBot', {
  channels: ['#speedrunslive']
});
var generateBlackoutSeed = require('./blackout-generator')

activeChannels = {};

goalSetRegex = /Goal Set: ([^-]+) - ([^|]+) | (#[^\s]+)/;

client.addListener('message', function(from, to, message) {
  if (from === 'RaceBot' && to === '#speedrunslive') {
    var r = goalSetRegex.exec;
    if (r && r[1].match(/Ocarina of Time/) && r[2].match(/blackout/i)) {
      client.join(r[3]);
    }
  }
  if (to != '#speedrunslive') {
    if (message.match(/^!blackout/)) {
      if (!activeChannels.hasOwnProperty(to)) {
        activeChannels[to] = { seed: new Promise((accept, reject) => {
          var seed = generateBlackoutSeed();
          accept(seed);
        }), norecord: false };
        client.say(to, "Blackout mode enabled. Goal will be set when race starts")
        client.say(to, "Type !noblackout to disable")
        client.say(to, "Type !norecord to automatically change the goal when the race ends")
      }
    }
    if (message.match(/^!noblackout/)) {
      if (activeChannels.hasOwnProperty(to)) {
        delete activeChannels[to];
        client.say(to, "Blackout mode disabled")
      }
    }
    if (message.match(/^!norecord/)) {
      if (activeChannels.hasOwnProperty(to) && !activeChannels[to].norecord) {
        activeChannels[to].norecord = true;
        client.say(to, "No Record mode enabled. Goal will be set to 'do not record' when the race ends")
        client.say(to, "Type !nonorecord to disable")
      }
    }
    if (message.match(/^!norecord/)) {
      if (activeChannels.hasOwnProperty(to) && activeChannels[to].norecord) {
        activeChannels[to].norecord = false;
        client.say(to, "No Record mode disabled.")
      }
    }
    if (from === 'RaceBot') {
      if (message.match(/Race Started/)) {
        if (activeChannels.hasOwnProperty(to)) {
          activeChannels[to].seed.then(seed => { client.say(to, `.setgoal blackout: http://speedrunslive.com/tools/oot-bingo/?seed=${seed}`); });
        }
      }
      if (message.match(/RAce Ended/)) {
        if (activeChannels.hasOwnProperty(to) && activeChannels[to].norecord) {
          client.say(to, '.setgoal do not record');
        }

      }
    }
  }
})

client.addListener('error', function(err) {
  console.log(err);
})
