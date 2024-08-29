(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],3:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],4:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],5:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],6:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],7:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],8:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/

(function (factory) {
  // Find the global object for export to both the browser and web workers.
  var globalObject = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window || (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' && self;

  // Setup highlight.js for different environments. First is Node.js or
  // CommonJS.
  if (typeof exports !== 'undefined') {
    factory(exports);
  } else if (globalObject) {
    // Export hljs globally even when using AMD for cases when this script
    // is loaded with others that may still expect a global hljs.
    globalObject.hljs = factory({});

    // Finally register the global hljs with AMD.
    if (typeof define === 'function' && define.amd) {
      define([], function () {
        return globalObject.hljs;
      });
    }
  }
})(function (hljs) {
  // Convenience variables for build-in objects
  var ArrayProto = [],
    objectKeys = Object.keys;

  // Global internal variables used within the highlight.js library.
  var languages = {},
    aliases = {};

  // Regular expressions used throughout the highlight.js library.
  var noHighlightRe = /^(no-?highlight|plain|text)$/i,
    languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
    fixMarkupRe = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;
  var spanEndTag = '</span>';

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  var options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  };

  // Object map that is used to escape some common HTML characters.
  var escapeRegexMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

  /* Utility functions */

  function escape(value) {
    return value.replace(/[&<>]/gm, function (character) {
      return escapeRegexMap[character];
    });
  }
  function tag(node) {
    return node.nodeName.toLowerCase();
  }
  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index === 0;
  }
  function isNotHighlighted(language) {
    return noHighlightRe.test(language);
  }
  function blockLanguage(block) {
    var i, match, length, _class;
    var classes = block.className + ' ';
    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    match = languagePrefixRe.exec(classes);
    if (match) {
      return getLanguage(match[1]) ? match[1] : 'no-highlight';
    }
    classes = classes.split(/\s+/);
    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i];
      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class;
      }
    }
  }
  function inherit(parent) {
    // inherit(parent, override_obj, override_obj, ...)
    var key;
    var result = {};
    var objects = Array.prototype.slice.call(arguments, 1);
    for (key in parent) result[key] = parent[key];
    objects.forEach(function (obj) {
      for (key in obj) result[key] = obj[key];
    });
    return result;
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3) offset += child.nodeValue.length;else if (child.nodeType === 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: 'stop',
              offset: offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }
  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];
    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset !== highlighted[0].offset) {
        return original[0].offset < highlighted[0].offset ? original : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:
       if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;
       ... which is collapsed to:
      */
      return highlighted[0].event === 'start' ? original : highlighted;
    }
    function open(node) {
      function attr_str(a) {
        return ' ' + a.nodeName + '="' + escape(a.value) + '"';
      }
      result += '<' + tag(node) + ArrayProto.map.call(node.attributes, attr_str).join('') + '>';
    }
    function close(node) {
      result += '</' + tag(node) + '>';
    }
    function render(event) {
      (event.event === 'start' ? open : close)(event.node);
    }
    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substring(processed, stream[0].offset));
      processed = stream[0].offset;
      if (stream === original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream === original && stream.length && stream[0].offset === processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event === 'start') {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function expand_mode(mode) {
    if (mode.variants && !mode.cached_variants) {
      mode.cached_variants = mode.variants.map(function (variant) {
        return inherit(mode, {
          variants: null
        }, variant);
      });
    }
    return mode.cached_variants || mode.endsWithParent && [inherit(mode)] || [mode];
  }
  function compileLanguage(language) {
    function reStr(re) {
      return re && re.source || re;
    }
    function langRe(value, global) {
      return new RegExp(reStr(value), 'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : ''));
    }
    function compileMode(mode, parent) {
      if (mode.compiled) return;
      mode.compiled = true;
      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords) {
        var compiled_keywords = {};
        var flatten = function flatten(className, str) {
          if (language.case_insensitive) {
            str = str.toLowerCase();
          }
          str.split(' ').forEach(function (kw) {
            var pair = kw.split('|');
            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
          });
        };
        if (typeof mode.keywords === 'string') {
          // string
          flatten('keyword', mode.keywords);
        } else {
          objectKeys(mode.keywords).forEach(function (className) {
            flatten(className, mode.keywords[className]);
          });
        }
        mode.keywords = compiled_keywords;
      }
      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);
      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
        }
        if (!mode.begin) mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
        if (mode.end) mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || '';
        if (mode.endsWithParent && parent.terminator_end) mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal) mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance == null) mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      mode.contains = Array.prototype.concat.apply([], mode.contains.map(function (c) {
        return expand_mode(c === 'self' ? mode : c);
      }));
      mode.contains.forEach(function (c) {
        compileMode(c, mode);
      });
      if (mode.starts) {
        compileMode(mode.starts, parent);
      }
      var terminators = mode.contains.map(function (c) {
        return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
      }).concat([mode.terminator_end, mode.illegal]).map(reStr).filter(Boolean);
      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {
        exec: function exec(/*s*/) {
          return null;
        }
      };
    }
    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:
   - relevance (int)
  - value (an HTML string with highlighting markup)
   */
  function highlight(name, value, ignore_illegals, continuation) {
    function subMode(lexeme, mode) {
      var i, length;
      for (i = 0, length = mode.contains.length; i < length; i++) {
        if (testRe(mode.contains[i].beginRe, lexeme)) {
          return mode.contains[i];
        }
      }
    }
    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }
    function isIllegal(lexeme, mode) {
      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
    }
    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }
    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      var classPrefix = noPrefix ? '' : options.classPrefix,
        openSpan = '<span class="' + classPrefix,
        closeSpan = leaveOpen ? '' : spanEndTag;
      openSpan += classname + '">';
      return openSpan + insideSpan + closeSpan;
    }
    function processKeywords() {
      var keyword_match, last_index, match, result;
      if (!top.keywords) return escape(mode_buffer);
      result = '';
      last_index = 0;
      top.lexemesRe.lastIndex = 0;
      match = top.lexemesRe.exec(mode_buffer);
      while (match) {
        result += escape(mode_buffer.substring(last_index, match.index));
        keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], escape(match[0]));
        } else {
          result += escape(match[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(mode_buffer);
      }
      return result + escape(mode_buffer.substr(last_index));
    }
    function processSubLanguage() {
      var explicit = typeof top.subLanguage === 'string';
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }
      var result = explicit ? highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) : highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (explicit) {
        continuations[top.subLanguage] = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }
    function processBuffer() {
      result += top.subLanguage != null ? processSubLanguage() : processKeywords();
      mode_buffer = '';
    }
    function startNewMode(mode) {
      result += mode.className ? buildSpan(mode.className, '', true) : '';
      top = Object.create(mode, {
        parent: {
          value: top
        }
      });
    }
    function processLexeme(buffer, lexeme) {
      mode_buffer += buffer;
      if (lexeme == null) {
        processBuffer();
        return 0;
      }
      var new_mode = subMode(lexeme, top);
      if (new_mode) {
        if (new_mode.skip) {
          mode_buffer += lexeme;
        } else {
          if (new_mode.excludeBegin) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
            mode_buffer = lexeme;
          }
        }
        startNewMode(new_mode, lexeme);
        return new_mode.returnBegin ? 0 : lexeme.length;
      }
      var end_mode = endOfMode(top, lexeme);
      if (end_mode) {
        var origin = top;
        if (origin.skip) {
          mode_buffer += lexeme;
        } else {
          if (!(origin.returnEnd || origin.excludeEnd)) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (origin.excludeEnd) {
            mode_buffer = lexeme;
          }
        }
        do {
          if (top.className) {
            result += spanEndTag;
          }
          if (!top.skip) {
            relevance += top.relevance;
          }
          top = top.parent;
        } while (top !== end_mode.parent);
        if (end_mode.starts) {
          startNewMode(end_mode.starts, '');
        }
        return origin.returnEnd ? 0 : lexeme.length;
      }
      if (isIllegal(lexeme, top)) throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

      /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexeme;
      return lexeme.length || 1;
    }
    var language = getLanguage(name);
    if (!language) {
      throw new Error('Unknown language: "' + name + '"');
    }
    compileLanguage(language);
    var top = continuation || language;
    var continuations = {}; // keep continuations for sub-languages
    var result = '',
      current;
    for (current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, '', true) + result;
      }
    }
    var mode_buffer = '';
    var relevance = 0;
    try {
      var match,
        count,
        index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match) break;
        count = processLexeme(value.substring(index, match.index), match[0]);
        index = match.index + count;
      }
      processLexeme(value.substr(index));
      for (current = top; current.parent; current = current.parent) {
        // close dangling modes
        if (current.className) {
          result += spanEndTag;
        }
      }
      return {
        relevance: relevance,
        value: result,
        language: name,
        top: top
      };
    } catch (e) {
      if (e.message && e.message.indexOf('Illegal') !== -1) {
        return {
          relevance: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:
   - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)
   */
  function highlightAuto(text, languageSubset) {
    languageSubset = languageSubset || options.languages || objectKeys(languages);
    var result = {
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    languageSubset.filter(getLanguage).forEach(function (name) {
      var current = highlight(name, text, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:
   - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers
   */
  function fixMarkup(value) {
    return !(options.tabReplace || options.useBR) ? value : value.replace(fixMarkupRe, function (match, p1) {
      if (options.useBR && match === '\n') {
        return '<br>';
      } else if (options.tabReplace) {
        return p1.replace(/\t/g, options.tabReplace);
      }
      return '';
    });
  }
  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang,
      result = [prevClassName.trim()];
    if (!prevClassName.match(/\bhljs\b/)) {
      result.push('hljs');
    }
    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }
    return result.join(' ').trim();
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var node, originalStream, result, resultNode, text;
    var language = blockLanguage(block);
    if (isNotHighlighted(language)) return;
    if (options.useBR) {
      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
    } else {
      node = block;
    }
    text = node.textContent;
    result = language ? highlight(language, text, true) : highlightAuto(text);
    originalStream = nodeStream(node);
    if (originalStream.length) {
      resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);
    block.innerHTML = result.value;
    block.className = buildClassName(block.className, language, result.language);
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Updates highlight.js global options with values passed in the form of an object.
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called) return;
    initHighlighting.called = true;
    var blocks = document.querySelectorAll('pre code');
    ArrayProto.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener('DOMContentLoaded', initHighlighting, false);
    addEventListener('load', initHighlighting, false);
  }
  function registerLanguage(name, language) {
    var lang = languages[name] = language(hljs);
    if (lang.aliases) {
      lang.aliases.forEach(function (alias) {
        aliases[alias] = name;
      });
    }
  }
  function listLanguages() {
    return objectKeys(languages);
  }
  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  /* Interface definition */

  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.inherit = inherit;

  // Common regexps
  hljs.IDENT_RE = '[a-zA-Z]\\w*';
  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]',
    relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'',
    end: '\'',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"',
    end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/
  };
  hljs.COMMENT = function (begin, end, inherits) {
    var mode = hljs.inherit({
      className: 'comment',
      begin: begin,
      end: end,
      contains: []
    }, inherits || {});
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    mode.contains.push({
      className: 'doctag',
      begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
      relevance: 0
    });
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
  hljs.NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: 'number',
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE + '(' + '%|em|ex|ch|rem' + '|vw|vh|vmin|vmax' + '|cm|mm|in|pt|pc|px' + '|deg|grad|rad|turn' + '|s|ms' + '|Hz|kHz' + '|dpi|dpcm|dppx' + ')?',
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//,
    end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [hljs.BACKSLASH_ESCAPE, {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [hljs.BACKSLASH_ESCAPE]
    }]
  };
  hljs.TITLE_MODE = {
    className: 'title',
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  return hljs;
});

},{}],9:[function(require,module,exports){
"use strict";

var hljs = require('./highlight');
module.exports = hljs;

},{"./highlight":8}],10:[function(require,module,exports){
"use strict";

var contents = require("./content/contents.md");
var introduction = require("./content/introduction.md");
var start = require("./content/start.md");
var inpractice = require("./content/inpractice.md");
var api = require("./content/api.md");
var extend = require("./content/extend.md");
var notes = require("./content/notes.md");
var highlight = require("./custom-highlightjs-build");
var highlightjs = require("highlight.js/lib/languages/javascript");
highlight.registerLanguage("js", highlightjs);
document.getElementById("toc1").innerHTML = contents;
document.getElementById("slide-out").innerHTML = '<li><a class="header">d3-annotation</a></li><li><div class="divider"></div></li>' + contents;
document.getElementById("introduction").innerHTML = introduction;
document.getElementById("setup").innerHTML = start;
document.getElementById("in-practice").innerHTML = inpractice;
document.getElementById("api").innerHTML = api;
document.getElementById("extend").innerHTML = extend;
document.getElementById("notes").innerHTML = notes;
$(document).ready(function () {
  $(".scrollspy").scrollSpy({
    scrollOffset: 0
  });
  $(".button-collapse").sideNav();
  $(".toc").pushpin({
    top: 140,
    offset: 0
  });
  $(".collapsible").collapsible();
  var defaultSettings = {
    className: "custom",
    subject: {},
    connector: {},
    note: {}
  };
  var typeSettings = JSON.parse(JSON.stringify(defaultSettings));
  var typeKey = "annotationLabel";
  var curve = "curveCatmullRom";
  var points = 2;
  var types = {
    annotationLabel: {
      typeSettings: {
        note: {
          align: "middle",
          orientation: "topBottom",
          bgPadding: 20,
          padding: 15
        },
        connector: {
          type: "line"
        },
        className: "show-bg"
      },
      summary: "A centered label annotation"
    },
    annotationCallout: {
      typeSettings: {
        note: {
          align: "dynamic",
          lineType: "horizontal",
          bgPadding: {
            top: 15,
            left: 10,
            right: 10,
            bottom: 10
          },
          padding: 15
        },
        connector: {
          type: "line"
        },
        className: "show-bg"
      },
      summary: "Adds a line along the note"
    },
    annotationCalloutElbow: {
      typeSettings: {
        note: {
          align: "dynamic",
          lineType: "horizontal"
        },
        connector: {
          type: "elbow"
        }
      },
      summary: "Keeps connector at 45 and 90 degree angles"
    },
    annotationCalloutCircle: {
      typeSettings: {
        note: {
          align: "dynamic",
          lineType: "horizontal"
        },
        connector: {
          type: "elbow"
        }
      },
      summary: "Subject options: radius, innerRadius, outerRadius, ",
      summaryCont: "radiusPadding",
      subject: {
        radius: 50,
        radiusPadding: 5
      }
    },
    annotationCalloutRect: {
      typeSettings: {
        note: {
          align: "dynamic",
          lineType: "horizontal"
        },
        connector: {
          type: "elbow"
        }
      },
      summary: "Subject options: width, height",
      subject: {
        width: -50,
        height: 100
      }
    },
    annotationCalloutCurve: {
      typeSettings: {
        note: {
          align: "dynamic",
          lineType: "horizontal"
        },
        connector: {
          type: "curve"
        }
      },
      summary: "Connector options: curve, ",
      summaryCont: "points(array of [x,y]s or number)"
    },
    annotationXYThreshold: {
      typeSettings: {
        note: {
          align: "dynamic",
          lineType: "horizontal"
        },
        connector: {
          type: "elbow"
        }
      },
      summary: "Subject options: x1, x2 or y1, y2",
      subject: {
        x1: 0,
        x2: 1000
      }
    },
    annotationBadge: {
      typeSettings: {
        note: {
          align: "dynamic",
          lineType: "horizontal"
        },
        connector: {
          type: "elbow"
        }
      },
      summary: "Subject options: radius, text, x:left or right, y:top or bottom",
      subject: {
        radius: 14,
        text: "A"
      }
    }
  };
  var currentType = d3.annotationCustomType(d3.annotationLabel, types.annotationLabel.typeSettings);
  var editMode = true;
  var textWrap = 120;
  var padding = types[typeKey].typeSettings.note.padding || 5;
  var annotation = {
    note: {
      label: "Longer text to show text wrapping",
      title: "Annotations :)"
    },
    className: types[typeKey].className,
    x: 150,
    y: 170,
    dy: 117,
    dx: 162
  };
  var changeOption = function changeOption() {
    var type = d3.event.target.attributes["data-section"].value;
    var value = d3.event.target.attributes["data-setting"].value;
    d3.selectAll("[data-section=\"".concat(type, "\"]")).classed("active", false);
    d3.selectAll("[data-section=\"".concat(type, "\"][data-setting=\"").concat(value, "\"]")).classed("active", true);
    if (type === "note:lineType") {
      if (value === "none") {
        d3.selectAll(".icons .orientation").classed("hidden", false);
      } else {
        d3.selectAll(".icons .orientation").classed("hidden", true);
      }
    }
    if (type === "note:lineType" && value === "vertical" || type === "note:orientation" && value === "leftRight") {
      d3.selectAll("[data-section='note:align'].horizontal").classed("hidden", true);
      d3.selectAll("[data-section='note:align'].vertical").classed("hidden", false);
    } else if (type === "note:lineType" && value === "horizontal" || type === "note:orientation" && value === "topBottom") {
      d3.selectAll("[data-section='note:align'].vertical").classed("hidden", true);
      d3.selectAll("[data-section='note:align'].horizontal").classed("hidden", false);
    }
    type = type.split(":");
    if (value === "none") {
      delete typeSettings[type[0]][type[1]];
      if (type[0] == "connector" && type[1] == "type") {
        makeAnnotations.disable(["connector"]);
        makeAnnotations.update();
      }
    } else {
      if (type[0] == "connector" && type[1] == "type") {
        var connectorTypes = ["annotationCallout", "annotationCalloutElbow", "annotationCalloutCurve"];
        if (connectorTypes.indexOf(typeKey) !== -1) {
          if (value == "line") {
            typeKey = "annotationCallout";
          } else if (value == "elbow") {
            typeKey = "annotationCalloutElbow";
          } else if (value == "curve") {
            typeKey = "annotationCalloutCurve";
          }
          d3.selectAll(".icons .presets img").classed("active", false);
          d3.selectAll("[data-type=\"".concat(typeKey, "\"]")).classed("active", true);
        } else {
          typeSettings[type[0]][type[1]] = value;
        }
        if (value == "curve") {
          d3.select("#curveButtons").classed("hidden", false);
        } else if (typeKey !== "annotationCalloutCurve") {
          d3.select("#curveButtons").classed("hidden", true);
        }
        makeAnnotations.disable([]);
        makeAnnotations.update();
      } else {
        typeSettings[type[0]][type[1]] = value;
      }
    }
    currentType = d3.annotationCustomType(d3[typeKey], typeSettings);
    updateAnnotations();
    sandboxCode();
  };
  d3.selectAll(".icons .options img").on("click", changeOption);
  d3.selectAll(".icons .presets .types img").on("click", function () {
    typeKey = d3.event.target.attributes["data-type"].value;
    currentType = d3.annotationCustomType(d3[typeKey], {
      className: types[typeKey].typeSettings.className,
      note: {
        bgPadding: types[typeKey].typeSettings.note.bgPadding
      }
    });
    d3.selectAll(".icons .presets img").classed("active", false);
    d3.selectAll("[data-type=\"".concat(typeKey, "\"]")).classed("active", true);
    typeSettings = JSON.parse(JSON.stringify(defaultSettings));
    if (typeKey == "annotationBadge") {
      d3.select("li.options").classed("hidden", true);
    } else {
      d3.select("li.options").classed("hidden", false);
    }

    //set options
    var options = types[typeKey].typeSettings;
    d3.selectAll(".icons .options img").classed("active", false);
    d3.select(".icons img[data-section=\"note:align\"][data-setting=\"".concat(options.note.align, "\"]")).classed("active", true);
    if (options.note.lineType) {
      d3.select(".icons img[data-section=\"note:lineType\"][data-setting=".concat(options.note.lineType, "]")).classed("active", true);
      d3.selectAll(".icons .orientation").classed("hidden", true);
    } else {
      d3.select(".icons img[data-section=\"note:lineType\"][data-setting=\"none\"]").classed("active", true);
      d3.selectAll(".icons .orientation").classed("hidden", false);
      d3.select(".icons .orientation img").classed("active", true);
    }
    d3.select('.icons img[data-section="connector:end"]').classed("active", true);
    d3.select(".icons img[data-section=\"connector:type\"][data-setting=".concat(options.connector.type, "]")).classed("active", true);
    if (typeKey == "annotationCalloutCurve") {
      d3.select("#curveButtons").classed("hidden", false);
    } else {
      d3.select("#curveButtons").classed("hidden", true);
    }
    d3.select("#sandbox-title").text("Use d3.".concat(typeKey, ":"));
    updateAnnotations();
    sandboxCode();
  });
  d3.select("#editmode").on("change", function () {
    editMode = d3.event.target.checked;
    makeAnnotations.editMode(editMode);
    makeAnnotations.update();
    sandboxCode();
  });
  d3.select("#textWrap").on("change", function () {
    textWrap = parseInt(d3.event.target.value);
    makeAnnotations.textWrap(textWrap).update();
    sandboxCode();
  });
  d3.select("#padding").on("change", function () {
    padding = parseInt(d3.event.target.value);
    makeAnnotations.notePadding(padding).update();
    sandboxCode();
  });
  var changeCurve = function changeCurve() {
    curve = d3.event.target.attributes["data-curve"].value;
    updateAnnotations({
      connector: {
        curve: d3[curve],
        points: points
      }
    });
    sandboxCode();
  };
  d3.selectAll("#curveButtons ul.curves li img").on("click", changeCurve).on("pointerdown", changeCurve);
  var changePoints = function changePoints() {
    points = parseInt(d3.event.target.attributes["data-points"].value);
    updateAnnotations({
      connector: {
        curve: d3[curve],
        points: points
      }
    });
    sandboxCode();
  };
  d3.selectAll("#curveButtons ul.points li a").on("click", changePoints).on("pointerdown", changePoints);
  window.makeAnnotations = d3.annotation().editMode(editMode).type(currentType).annotations([annotation]);
  d3.select(".sandbox").append("g").attr("class", "sandbox-annotations").call(makeAnnotations);
  var updateAnnotations = function updateAnnotations(newSettings) {
    d3.select(".sandbox g.sandbox-annotations").remove();
    var subject = types[typeKey].subject || {};
    makeAnnotations.type(currentType, {
      subject: subject,
      connector: newSettings && newSettings.connector
    });
    d3.select(".sandbox").append("g").attr("class", "sandbox-annotations").call(makeAnnotations);
    d3.select(".sandbox .type").text("d3.".concat(typeKey));
    d3.select(".sandbox .summary").text(types[typeKey].summary);
    d3.select(".sandbox .summaryCont").text(types[typeKey].summaryCont || "");
  };

  //change the text to have the right position for the annotation

  var sandboxCode = function sandboxCode() {
    var editModeText = editMode ? "  .editMode(true)\n" : "";
    var typeText = "\nconst type = ";
    if (JSON.stringify(typeSettings) == JSON.stringify(defaultSettings)) {
      typeText += "d3.".concat(typeKey, "\n");
    } else {
      var json = JSON.parse(JSON.stringify(typeSettings));

      //if (Object.keys(json.subject).length === 0){
      delete json.subject;
      //}

      if (Object.keys(json.connector).length === 0) {
        delete json.connector;
      }
      if (Object.keys(json.note).length === 0) {
        delete json.note;
      }
      typeText += "d3.annotationCustomType(\n" + "  d3.".concat(typeKey, ", \n") + "  ".concat(JSON.stringify(json).replace(/,/g, ",\n    ")) + ")\n";
    }
    var disableText = "";
    if (makeAnnotations.disable().length !== 0) {
      disableText = "  //could also be set in the a disable property\n  //of the annotation object\n" + "  .disable(".concat(JSON.stringify(makeAnnotations.disable()), ")\n");
    }
    var textWrapText = "";
    if (textWrap !== 120) {
      textWrapText = "  //also can set and override in the note.wrap property\n  //of the annotation object\n" + "  .textWrap(".concat(textWrap, ")\n");
    }
    var paddingText = "";
    if (padding !== 5) {
      paddingText = "  //also can set and override in the note.padding property\n  //of the annotation object\n" + "  .notePadding(".concat(padding, ")\n");
    }
    var curveText = "";
    if ((typeKey == "annotationCalloutCurve" || typeSettings.connector.type == "curve") && (curve !== "curveCatmullRom" || points !== 2)) {
      curveText = "        connector: {\n" + (curve !== "curveCatmullRom" ? "          curve: d3.".concat(curve) : "") + (points !== 2 && curve !== "curveCatmullRom" ? ",\n" : "") + (points !== 2 ? "          points: ".concat(points) : "") + "\n" + "        }";
    }
    var subjectText = "";
    if (typeKey === "annotationCalloutCircle") {
      subjectText = "  subject: {\n" + "    radius: 50,\n" + "    radiusPadding: 5\n" + "  }\n";
    } else if (typeKey == "annotationCalloutRect") {
      subjectText = "  subject: {\n" + "    width: -50,\n" + "    height: 100\n" + "  }\n";
    } else if (typeKey == "annotationXYThreshold") {
      subjectText = "  subject: {\n" + "    x1: 0,\n" + "    x2: 500\n" + "  }\n";
    } else if (typeKey == "annotationBadge") {
      subjectText = "  subject: {\n" + '    text: "A",\n' + "    radius: 14\n" + "  }\n";
    }
    d3.select("#sandbox-code code").text(typeText + "\n" + "const annotations = [{\n" + "  note: {\n" + '    label: "Longer text to show text wrapping",\n' + (types[typeKey] && types[typeKey].typeSettings.note && types[typeKey].typeSettings.note.bgPadding && "    bgPadding: ".concat(JSON.stringify(types[typeKey].typeSettings.note.bgPadding), ",\n") || "") + '    title: "Annotations :)"\n' + "  },\n" + "  //can use x, y directly instead of data\n" + '  data: { date: "18-Sep-09", close: 185.02 },\n' + (types[typeKey] && types[typeKey].typeSettings.className && "  className: ".concat(JSON.stringify(types[typeKey].typeSettings.className), ",\n") || "") + "  dy: 137,\n" + "  dx: 162".concat(curveText !== "" || subjectText !== "" ? "," : "", "\n") + curveText + (subjectText !== "" && curveText !== "" ? ",\n" : "") + subjectText + "}]\n" + "\n" + 'const parseTime = d3.timeParse("%d-%b-%y")\n' + 'const timeFormat = d3.timeFormat("%d-%b-%y")\n' + "\n" + "//Skipping setting domains for sake of example\n" + "const x = d3.scaleTime().range([0, 800])\n" + "const y = d3.scaleLinear().range([300, 0])\n" + "\n" + "const makeAnnotations = d3.annotation()\n" + editModeText + disableText + textWrapText + paddingText + "  .type(type)\n" + "  //accessors & accessorsInverse not needed\n" + "  //if using x, y in annotations JSON\n" + "  .accessors({\n" + "    x: d => x(parseTime(d.date)),\n" + "    y: d => y(d.close)\n" + "  })\n" + "  .accessorsInverse({\n" + "     date: d => timeFormat(x.invert(d.x)),\n" + "     close: d => y.invert(d.y)\n" + "  })\n" + "  .annotations(annotations)\n" + "\n" + 'd3.select("svg")\n' + '  .append("g")\n' + '  .attr("class", "annotation-group")\n' + "  .call(makeAnnotations)\n");
    $("code").each(function (i, block) {
      highlight.highlightBlock(block);
    });
  };
  sandboxCode();
});

},{"./content/api.md":1,"./content/contents.md":2,"./content/extend.md":3,"./content/inpractice.md":4,"./content/introduction.md":5,"./content/notes.md":6,"./content/start.md":7,"./custom-highlightjs-build":9,"highlight.js/lib/languages/javascript":11}],11:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    aliases: ['js'],
    keywords: {
      keyword:
        'in of if for while finally var new function do return void else break catch ' +
        'instanceof with throw case default try this switch continue typeof delete ' +
        'let yield const export super debugger as async await',
      literal:
        'true false null undefined NaN Infinity',
      built_in:
        'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
        'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
        'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
        'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
        'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
        'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
        'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' +
        'Promise'
    },
    contains: [
      {
        className: 'pi',
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      { // template string
        className: 'string',
        begin: '`', end: '`',
        contains: [
          hljs.BACKSLASH_ESCAPE,
          {
            className: 'subst',
            begin: '\\$\\{', end: '\\}'
          }
        ]
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'number',
        variants: [
          { begin: '\\b(0[bB][01]+)' },
          { begin: '\\b(0[oO][0-7]+)' },
          { begin: hljs.C_NUMBER_RE }
        ],
        relevance: 0
      },
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.REGEXP_MODE,
          { // E4X / JSX
            begin: /</, end: />\s*[);\]]/,
            relevance: 0,
            subLanguage: 'xml'
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        beginKeywords: 'function', end: /\{/, excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: /[A-Za-z$_][0-9A-Za-z$_]*/}),
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            contains: [
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          }
        ],
        illegal: /\[|%/
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      {
        begin: '\\.' + hljs.IDENT_RE, relevance: 0 // hack: prevents detection of keywords after dots
      },
      // ECMAScript 6 modules import
      {
        beginKeywords: 'import', end: '[;$]',
        keywords: 'import from as',
        contains: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      },
      { // ES6 class
        className: 'class',
        beginKeywords: 'class', end: /[{;=]/, excludeEnd: true,
        illegal: /[:"\[\]]/,
        contains: [
          {beginKeywords: 'extends'},
          hljs.UNDERSCORE_TITLE_MODE
        ]
      }
    ],
    illegal: /#/
  };
};
},{}]},{},[10]);
