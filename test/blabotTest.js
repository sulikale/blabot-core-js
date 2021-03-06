var assert = require('assert');
var should = require('should');
var B = require('..');

describe('Blabot', function () {

  describe('getSentence', function () {
    it('given simple dictionary should build sentence', function () {
      var dict = {
        words: {
          '1': ['a'],
          '2': ['bb'],
          '3': ['ccc']
        },
        sentences: ['<1>, <2>–<3>?']
      };

      B.dictionary(dict);
      assert.equal('A, bb–ccc?', B.sentence());
    });
    it('given dictionary in constructor should build sentence', function(){
      var dict = {
        words: {
          '1': ['a'],
          '2': ['bb'],
          '3': ['ccc']
        },
        sentences: ['<1>, <2>–<3>?']
      };

      var B1 = require('..').createBlabot(dict);
      assert.equal('A, bb–ccc?', B1.sentence());
    });
    it('given more complex dictionary should build sentence', function () {
      var dict = {
        words: {
          '1': ['a', 'b'],
          '2': ['aa', 'bb'],
          '3': ['aaa', 'bbb'],
          '111': ['stojedenáct', 'takystojedenáct']
        },
        sentences: [
          '<1> – <2>!',
          '<3>, <3>?',
          '<111>, <111>…'
        ]
      };

      var possibleSentences = [
        'Stojedenáct, takystojedenáct…',
        'Takystojedenáct, stojedenáct…',
        'Stojedenáct, stojedenáct…',
        'Takystojedenáct, takystojedenáct…',
        'Aaa, aaa?',
        'Bbb, bbb?',
        'Aaa, bbb?',
        'Bbb, aaa?',
        'A – aa!',
        'A – bb!',
        'B – aa!',
        'B – bb!'
      ];
      B.dictionary(dict);
      for (var i = 12; i > 0; i--) {
        var sentence = B.sentence();
        possibleSentences.should.containEql(sentence);
      }
    });
  });

  describe('getSentences', function () {
    var dict = {
      words: {
        '1': ['a', 'b'],
        '2': ['aa', 'bb'],
        '3': ['aaa', 'bbb'],
        '8': ['fourfour', '12345678']
      },
      sentences: [
        '<1> – <2>!',
        '<3>, <3>?',
        '<8>, <8>…'
      ]
    };

    var possibleSentences = [
      'Fourfour, 12345678…',
      '12345678, fourfour…',
      'Fourfour, fourfour…',
      '12345678, 12345678…',
      'Aaa, aaa?',
      'Bbb, bbb?',
      'Aaa, bbb?',
      'Bbb, aaa?',
      'A – aa!',
      'A – bb!',
      'B – aa!',
      'B – bb!'
    ];

    it('should build sentence by count', function () {
      var count = 42;
      B.dictionary(dict);
      var sentences = B.sentences(count);
      assert.equal(sentences.length, count);
      sentences.forEach(function (sentence) {
        possibleSentences.should.containEql(sentence);
      });
    });
  });

  describe('getWord', function () {
    var dict = {
      words: {
        '1': ['a', 'b'],
        '2': ['aa', 'bb'],
        '3': ['aaaa', 'bbb'],
        '4': ['aaaa', 'bbbb'],
        '5': ['ááááá', 'ččččč'],
        '6': ['žžžžžž', 'šššššš'],
        '7': ['řřřřřřř', 'ěěěěěěě']
      },
      sentences: [
        '<1> – <2>!',
        '<3>, <3>?',
        '<7>, <7>…'
      ]
    };
    it('should return random word from dictionary', function () {
      B.dictionary(dict);
      for (var i = 42; i > 0; i--) {
        var actual = B.word();
        dict.words[actual.length].should.containEql(actual);
      }
    });
  });

  describe('getParagraph', function () {
    var dict = {
      words: {
        '1': ['a']
      },
      sentences: [
        '<1>!'
      ]
    };
    it('should return 5-10 sentences separated by space', function () {
      B.dictionary(dict);
      var actual = B.paragraph().split(' ');
      actual.length.should.be.above(4);
      actual.length.should.be.below(11);
      var actualUq = actual.filter(function (elem, pos) {
        return actual.indexOf(elem) == pos;
      });
      actualUq.length.should.be.eql(1);
      actualUq[0].should.eql('A!');
    });
  });

});