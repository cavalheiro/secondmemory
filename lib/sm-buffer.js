'use babel'

/* --------------------------------------------------------
  Bullet item configuration
  - general settings
  - rotating label definitions
*/
const BulletConf = {

// General settings

  bullet: '*',
  bulletSub: '-',

// Labels

  checkbox: {
    tokens: ["[ ]", "[x]"],
    spacer: " ",
    rootScope: "bullet",
    contentScope: "text",
  },
  heading: {
    tokens: ["#", "##", "###", "####", "#####", "######"],
    spacer: " ",
    rootScope: "line",
    contentScope: "line",
  },
  star: {
    tokens: ["⭐", "📣"],
    spacer: " ",
    rootScope: "item",
    contentScope: "text",
  },
  todo: {
    tokens: ["[TODO]", "[DONE]"],
    spacer: " ",
    rootScope: "bullet",
    contentScope: "text",
  },
  priority: {
    tokens: ["[>]", "[>>]"],
    spacer: " ",
    rootScope: "task",
    contentScope: "text",
  }
}

/* --------------------------------------------------------
  Buffer manipulation functions, that include:
  - dynamic widgets (rotate labels)
  - small snippets (dates, etc)
 */

const BufferUtils = {

  indent: function () {
    editor = atom.workspace.getActiveTextEditor()
    editor.indentSelectedRows()
  },

  outdent: function () {
    editor = atom.workspace.getActiveTextEditor()
    editor.outdentSelectedRows()
  },

  insert8601Date: function () {
    d = new Date()
    editor = atom.workspace.getActiveTextEditor()
    editor.insertText(Utils.getISO8601Date(d))
  },

  insertTimelineDate: function () {
    d = new Date()
    editor = atom.workspace.getActiveTextEditor()
    editor.insertText('### ' + Utils.getISO8601Date(d) + '\n\n  * ')
  },

  newBulletLine: function () {
    const editor = atom.workspace.getActiveTextEditor()
    const scopes = getSelectedLineScopes(editor)
    // get first char from current line bullet scope and use it to prefix the new line
    const bulletScope = scopes['bullet']
    // insert new line
    editor.insertNewline()
    if (bulletScope) {
      const symbol = bulletScope.text.charAt(0)
      editor.insertText(symbol + ' ')
    }
  },

  newBulletSub: function () {
    const editor = atom.workspace.getActiveTextEditor()
    editor.insertNewline()
    editor.insertText(BulletConf.bulletSub + ' ')
    editor.indentSelectedRows()
  },

  // Accept a snippet config object, cycle through its options and update buffer
  rotLabel: function (cfg, direction) {
    const editor = atom.workspace.getActiveTextEditor()
    const scopes = getSelectedLineScopes(editor)
    const rootScope = scopes[cfg.rootScope]
    // check if we are inside the root scope
    if (!rootScope) return

    const row = rootScope.start.row
    let tokens =  cfg.tokens
    let tokenRange
    let nextValue
    let cycle = false
    if (!direction) {
      direction = 1
      cycle = true
    }

    for (const [i, t] of tokens.entries()) {
      // check if option text exists on root scope and get its position
      if ((optIndex = rootScope.text.indexOf(t)) == -1) continue;
      // get range for token
      optIndex += rootScope.start.col
      tokenRange = [[row,  optIndex], [row, optIndex + t.length]]
      // check if the token found is last in the array
      if (i+direction >= 0 && i+direction < tokens.length) {
        nextValue = tokens[i+direction]
      }
      else { // last token in cycle, remove it from line
        if (!cycle && direction == 1) return;
        if (cfg.spacer && cfg.spacer != "")
        tokenRange[1][1] += cfg.spacer.length //add spacer to range calculation
        nextValue = ""
      }
    }
    // token not found, add first token in array to the line
    if (!tokenRange) {
      if (direction == -1) return;
      else if (scopes[cfg.contentScope]) {
        contentCol = scopes[cfg.contentScope].start.col
      }
      else {
        contentCol = rootScope.end.col
      }
      tokenRange = [[row,contentCol], [row,contentCol]]
      nextValue = tokens[0] + cfg.spacer
    }
    editor.setTextInBufferRange(tokenRange, nextValue)
  }
}

module.exports = { BufferUtils , BulletConf }


/* --------------------------------------------------------
  Common utility functions
*/

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
      if (!scopes[s]) {
        scopes[s] = {}
        scopes[s]['text'] = obj.value
        scopes[s]['start'] = scopeStartPoint
        scopes[s]['end'] = { row: cursorPos.row, col: indexInLine + tokenLen }
      } else {
        scopes[s]['text'] += obj.value
        scopes[s]['end'] = { row: cursorPos.row, col: scopes[s].end.col + tokenLen }
      }
    }
  }
  // console.log(scopes)
  return scopes
}
