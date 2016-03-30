var bingoFunc = require('./bingo/generator')
var bingoList = require('./bingo/goal-list')

var bingoOpts = {
  seed: Math.ceil(999999 * Math.random()).toString(),
  mode: 'normal',
  lang: 'name'
};

var regexes = [ {regex: /\d(?: different)? unused keys in Gerudo Training Grounds/, maxcount: 1, count: 0},
        {regex: /\d Maps/, maxcount: 1, count: 0},
        {regex: /\d Compasses/, maxcount: 1, count: 0},
        {regex: /\d Hearts/, maxcount: 1, count: 0},
        {regex: /At least \d songs/, maxcount: 1, count: 0},
        {regex: /(?:3 Shields & 3 [^\s]+|3 [^\s]+ & 3 Shields|Mirror Shield)/, maxcount: 1, count: 0},
        {regex: /(?:3 Swords & 3 [^\s]+|3 [^\s]+ & 3 Swords|Giant's Knife)/, maxcount: 1, count: 0},
        {regex: /(?:3 Boots|3 Boots & 3 [^\s]+|3 [^\s]+ & 3 Boots|Iron Boots)/, maxcount: 1, count: 0},
        {regex: /(?:3 Tunics|3 Tunics & 3 [^\s]+|3 [^\s]+ & 3 Tunics|Goron Tunic)/, maxcount: 1, count: 0},
        {regex: /(?:3 Tunics|3 Tunics & 3 [^\s]+|3 [^\s]+ & 3 Tunics|Zora Tunic)/, maxcount: 1, count: 0},
        {regex: /(?:All 5 Skulltulas in Shadow Temple|At least 4 Skulltulas in Shadow Temple)/, maxcount: 1, count: 0},
        {regex: /(?:All 5 Skulltulas in Water Temple|At least 3 Skulltulas in Water Temple|Defeat Dark Link|Longshot)/, maxcount: 1, count: 0},
        {regex: /At least \d Magic Beans/, maxcount: 1, count: 0},
        {regex: /(?:[^\s]+ Gauntlets|Goron Bracelet)/, maxcount: 3, count: 0},
        {regex: /(?:Beat the Deku Tree|Defeat Queen Gohma)/, maxcount: 1, count: 0},
        {regex: /(?:Beat Dodongo's Cavern|Defeat King Dodongo)/, maxcount: 1, count: 0},
        {regex: /(?:Beat Jabu-Jabu's Belly|Defeat Barinade)/, maxcount: 1, count: 0},
        {regex: /(?:Beat the Forest Temple|Defeat Phantom Ganon)/, maxcount: 1, count: 0},
        {regex: /(?:Beat the Fire Temple|Defeat Volvagia)/, maxcount: 1, count: 0},
        {regex: /(?:Beat the Water Temple|Defeat Morpha)/, maxcount: 1, count: 0},
        {regex: /(?:Beat the Shadow Temple|Defeat Bongo-Bongo)/, maxcount: 1, count: 0},
        {regex: /(?:Beat the Spirit Temple|Defeat Twinrova|Mirror Shield)/, maxcount: 1, count: 0},
        {regex: /(?:Saria's Song|Goron Bracelet)/, maxcount: 1, count: 0},
        {regex: /(?:Saria's Song|Green Gauntlets)/, maxcount: 1, count: 0},
        {regex: /(?:Saria's Song|Both heart pieces in Lost Woods)/, maxcount: 1, count: 0},
        {regex: /(?:Din's Fire|Two Fairy Spells)/, maxcount: 1, count: 0},
        {regex: /(?:Farore's Wind|Two Fairy Spells)/, maxcount: 1, count: 0},
        {regex: /(?:Nayru's Love|Two Fairy Spells)/, maxcount: 1, count: 0},
      ];

function generateBlackoutSeed() {
  var bad = false;
  do {
    bad = false;
    for (var r of regexes) r.count = 0;
    bingoOpts.seed = Math.ceil(999999 * Math.random()).toString();
    var bingoBoard = bingoFunc(bingoList, bingoOpts);
    if(bingoBoard) {
      for (i=1; i<=25; i++) {
        for(var r of regexes) {
          if (r.regex.exec(bingoBoard[i].name) != null) { r.count++; }
          if (r.count > r.maxcount) bad = true;

        }
        for (j=1; j<=25; j++) {
          if (i == j) continue;
          if (bingoBoard[i].name == bingoBoard[j].name) { bad = true; }
        }
      }
    } else {
      bad = true;
    }
  } while(bad);
  return bingoOpts.seed;
}

module.exports = generateBlackoutSeed;
