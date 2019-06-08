'use babel'

/* --------------------------------------------------------
  Bullet item configuration
  - general settings
  - rotating label definitions
*/
const SymbolConf = {

// General settings

  heading: '#',
  list_l1: '-',
  list_l2: '*',
  list_l3: '+',
  quote: '>',

// Labels
  checkbox: {
    tokens: ["[ ]", "[/]", "[o]", "[>]", "[x]", "[-]", "[<]"],
    rootScope: "bullet",
    insertBefore: "text",
  },
  star: {
    tokens: ["⭐"],
    rootScope: "bullet",
    insertBefore: "text",
  }
}

/* --------------------------------------------------------
  Buffer manipulation functions, that include:
  - dynamic widgets (rotate labels)
  - small snippets (dates, etc)
 */


const BufferUtils = {

  createElement: function (scopeName, symbol, addTab) {
    editor = atom.workspace.getActiveTextEditor()
    const scopes = getSelectedLineScopes(editor)
    var text = scopes['text'] ? scopes['text'].text : ''
    var tabText = addTab ? editor.getTabText() : ''
    var s = scopes['line']
    var range = [[s.start.row, s.start.col], [s.end.row, s.end.col]]
    editor.transact(0, () => {
      if (!scopes[scopeName]) {
        editor.transact(0, () => {
          editor.setTextInBufferRange(range, tabText + symbol + ' ' + text)
        })
      } else {
        editor.setTextInBufferRange(range, tabText + text)
      }
    })
  },

  createHeading: function () {
    this.createElement('heading', SymbolConf.heading)
  },

  createList: function () {
    this.createElement('bullet', SymbolConf.list_l1)
  },

  createQuote: function () {
    this.createElement('quote', SymbolConf.quote)
  },

  indent: function () {
    editor = atom.workspace.getActiveTextEditor()
    const scopes = getSelectedLineScopes(editor)
    if (scopes['heading'] && scopes['symbol']) {
      var s = scopes['symbol']
      var range = [[s.start.row, s.start.col], [s.end.row, s.end.col]]
      if (s.text.length < 6) {
        editor.setTextInBufferRange(range, s.text + SymbolConf.heading)
      }
    }
    else if (scopes['bullet']) {
      var s = scopes['symbol']
      var range = [[s.start.row, s.start.col], [s.end.row, s.end.col]]
      var leadingSpace = scopes['leadingspace'] ? scopes['leadingspace'].text.length : 0
      const tabLength = editor.getTabLength()
      const level = (tabLength + leadingSpace) / tabLength
      var symbol = SymbolConf.list_l1; // default
      switch (level) {
        case 0: symbol = SymbolConf.list_l1; break
        case 1: symbol = SymbolConf.list_l2; break
        case 2: symbol = SymbolConf.list_l3; break
      }
      editor.transact(0, () => {
        editor.setTextInBufferRange(range, symbol)
        editor.indentSelectedRows()
      })
    }
    else {
      if (!scopes['text']) editor.insertText(editor.getTabText())
      else editor.indentSelectedRows()
    }
  },

  outdent: function () {
    editor = atom.workspace.getActiveTextEditor()
    const scopes = getSelectedLineScopes(editor)
    if (scopes['heading']) {
      var s = scopes['symbol']
      var range = [[s.start.row, s.start.col], [s.end.row, s.end.col]]
      if (s.text.length > 1) {
        editor.setTextInBufferRange(range, s.text.slice(0, -1))
      }
    }
    else if (scopes['bullet']) {
      var s = scopes['symbol']
      var range = [[s.start.row, s.start.col], [s.end.row, s.end.col]]
      var leadingSpace = scopes['leadingspace'] ? scopes['leadingspace'].text.length : 0
      const tabLength = editor.getTabLength()
      const level = (leadingSpace - tabLength) / tabLength
      var symbol = SymbolConf.list_l1 // default
      switch (level) {
        case 0: symbol = SymbolConf.list_l1; break
        case 1: symbol = SymbolConf.list_l2; break
        case 2: symbol = SymbolConf.list_l3; break
      }
      editor.transact(0, () => {
        editor.setTextInBufferRange(range, symbol)
        editor.outdentSelectedRows()
      })
    }
    else {
      editor.outdentSelectedRows()
    }
  },

  insertDate: function () {
    editor = atom.workspace.getActiveTextEditor()
    date = new Date()
    editor.insertText(date.toLocaleDateString("en-GB"))
  },

  insertLineBefore: function () {
    editor = atom.workspace.getActiveTextEditor()
    editor.transact(0, () => {
      range = editor.getBuffer().rangeForRow(editor.getCursorBufferPosition().row)
      curText = editor.getTextInBufferRange(range)
      editor.setTextInBufferRange(range, '\n' + curText)
    })
  },

  newLine: function () {
    const editor = atom.workspace.getActiveTextEditor()
    const curScopes = editor.scopeDescriptorForBufferPosition(editor.getCursorBufferPosition()).scopes
    const lineScopes = getSelectedLineScopes(editor)

    const p1 = editor.getCursorBufferPosition()
    const r1 = editor.getBuffer().rangeForRow(p1.row)
    const isCursorAtEndOfLine = !editor.getTextInBufferRange([p1, r1.end]).trim()

    editor.transact(0, () => {
      if ((curScopes.includes('bullet') || curScopes.includes('quote') || curScopes.includes('heading')) && isCursorAtEndOfLine) {
        if (!lineScopes.text) {
          editor.deleteToBeginningOfWord()
          editor.outdentSelectedRows()
        }
        else {
          editor.moveToEndOfLine()
          editor.insertNewline()
          editor.insertText(lineScopes.symbol.text + ' ')
        }
      }
      else {
        editor.insertNewline()
      }
    })
  },

  toggleEmphasis: function (type) {
    
    const editor = atom.workspace.getActiveTextEditor()
    const grammar = editor.getGrammar()
    const curText = editor.getWordUnderCursor()
    var selectedRange = editor.getSelectedBufferRange()
    var symbol

    // Set the right symbol for the desired emphasis
    switch (type) {
      case "bold": symbol = "**"; break
      case "italic": symbol = "_"; break
      case "strikethrough": symbol = "~~"
    }
    
    // Return if cursor is above emphasis symbol  
    if (selectedRange.isEmpty() && (!curText || curText.includes(symbol))) return  

    const controlPos = !selectedRange.isEmpty() ? selectedRange.start : editor.getCursorBufferPosition()
    const curScopes = editor.scopeDescriptorForBufferPosition(controlPos).scopes
    
    // The cursor is already on top of an existing emphasis element 
    if (curScopes.indexOf('emphasis.' + type) > -1) { 
      var rangeStart, rangeEnd
      
      // inner function to check if the selected text contains the emphasis symbol
      function getEmphasisRange() { 
        if (editor.getSelectedText().includes(symbol)) { 
          return editor.getSelectedBufferRange()
        }  
      }
      // select all text enclosed by the emphasis symbols
      while (1) {
        if (!rangeStart) { 
          editor.selectLeft()
          rangeStart = getEmphasisRange();
        }
        else if (!rangeEnd) { 
          editor.selectRight()
          rangeEnd = getEmphasisRange();
        }
        else break;
      }
      fullRange = rangeStart.union(rangeEnd)
      re = new RegExp(escape(symbol), 'g');
      text = editor.getTextInBufferRange(fullRange).replace(re, '')
      editor.setSelectedBufferRange(fullRange)
      editor.setTextInBufferRange(fullRange, text)
    }
    else {
      // check if we have any range selected and select current word otherwise
      if (selectedRange.isEmpty()) { 
        editor.selectWordsContainingCursors()
        selectedRange = editor.getSelectedBufferRange()
      }
      text = editor.getSelectedText()   
      editor.setTextInBufferRange(selectedRange, symbol + text + symbol)
    }
  },

  // Accept a snippet config object, loop through its options and update buffer
  rotLabel: function (cfg, direction) {
    const editor = atom.workspace.getActiveTextEditor()
    const scopes = getSelectedLineScopes(editor)
    const rootScope = scopes[cfg.rootScope]
    console.log(scopes)
    // check if we are inside the root scope
    if (!rootScope) return

    const row = rootScope.start.row
    let tokens =  cfg.tokens
    let tokenRange
    let nextValue
    let contentCol
    let loop = false
    if (!direction) {
      direction = 1
      loop = true
    }

    if (insertBefore = scopes[cfg.insertBefore]) {
      contentCol = insertBefore.start.col
      // if (optIndex > contentCol) break;
    }
    else contentCol = rootScope.end.col

    for (const [i, t] of tokens.entries()) {
      // check if option text exists on root scope and get its position
      if ((optIndex = rootScope.text.indexOf(t+' ')) != -1) {
        // get range for token
        optIndex += rootScope.start.col
        tokenRange = [[row,  optIndex], [row, optIndex + t.length]]
        // check if the token found is last in the array
        if (i+direction >= 0 && i+direction < tokens.length) {
          nextValue = tokens[i+direction]
        }
        else if (loop) {
          if (cfg.emptyValue == false) {
            if (direction<0) { nextValue = tokens[tokens.length-1] }
            else { nextValue = tokens[0] }
          }
          else {
            nextValue = ""
            tokenRange[1][1]+=1
          }
        }
        break;
      }
    }
    // token not found, add first token in array to the line
    if (!tokenRange) {
      if (direction == -1) return;
      tokenRange = [[row,contentCol], [row,contentCol]]
      nextValue = tokens[0] + ' ' //add a whitespace after a new label
    }
    if (nextValue != null) editor.setTextInBufferRange(tokenRange, nextValue)
  }
}

module.exports = { BufferUtils , SymbolConf }


/* --------------------------------------------------------
  Common utility functions
*/

function escape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// returns an object with tokens and their position
function getSelectedLineScopes (editor) {
  grammar = editor.getGrammar()
  cursorPos = editor.getCursorBufferPosition()
  lineText = editor.lineTextForBufferRow(cursorPos.row)
  lineTokens = grammar.tokenizeLine(lineText).tokens

  let scopes = {}
  for(var obj of lineTokens) {
    // console.log(obj)
    let tokenLen = obj.value.length
    let indexInLine = lineText.indexOf(obj.value)
    let scopeStartPoint = { row: cursorPos.row, col: indexInLine }
    for(s of obj.scopes) {
      let tk = {}
      tk['text'] = obj.value
      tk['start'] = scopeStartPoint
      tk['end'] = { row: cursorPos.row, col: indexInLine + tokenLen }
      if (!scopes[s]) {
        scopes[s] = {}
        scopes[s]['tokens'] = []
        scopes[s]['text'] = tk['text']
        scopes[s]['start'] = tk['start']
        scopes[s]['end'] = tk['end']
      } else {
        scopes[s]['text'] += obj.value
        scopes[s]['end'] = { row: cursorPos.row, col: scopes[s].end.col + tokenLen }
      }
      scopes[s]['tokens'].push(tk)
    }
  }
  return scopes
}
