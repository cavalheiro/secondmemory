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

  defaultheading: {
    tokens: ["###"],
    spacer: " ",
    rootScope: "line",
    contentScope: "line",
  },
  list: {
    tokens: ["*", "-"],
    spacer: " ",
    rootScope: "line",
    contentScope: "text",
    emptyValue: false
  },
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
    emptyValue: false
  },
  star: {
    tokens: ["⭐"],
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
  },
  progress: {
    tokens: ["[=    ]", "[==   ]", "[===  ]", "[==== ]", "[=====]"],
    spacer: " ",
    rootScope: "bullet",
    contentScope: "text",
    insertAfter: true
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
    const scopes = getSelectedLineScopes(editor)
    if (scopes['heading']) {
      this.rotLabel(BulletConf.heading, 1)
      return
    }
    else {
      this.rotLabel(BulletConf.list, 1)
      editor.indentSelectedRows()
    }
  },

  outdent: function () {
    editor = atom.workspace.getActiveTextEditor()
    const scopes = getSelectedLineScopes(editor)
    if (scopes['heading']) {
      this.rotLabel(BulletConf.heading, -1)
      return
    }
    else {
      editor.outdentSelectedRows()
      this.rotLabel(BulletConf.list, -1)
    }
  },

  insert8601Date: function () {
    editor = atom.workspace.getActiveTextEditor()
    editor.insertText(get8601Date())
  },

  insertTimelineDate: function () {
    editor = atom.workspace.getActiveTextEditor()
    editor.insertText('### ' + get8601Date() + '\n\n')
  },

  newLine: function () {
    const editor = atom.workspace.getActiveTextEditor()
    const curScopes = editor.scopeDescriptorForBufferPosition(editor.getCursorBufferPosition()).scopes
    const lineScopes = getSelectedLineScopes(editor)
    // insert new line
    // if (curScopes.includes('heading')) {
    //   editor.insertNewline()
    //   editor.insertText(BulletConf.bullet + ' ')
    //   editor.indentSelectedRows()
    // } else
    if (curScopes.includes('bullet')) {
      if (curScopes.includes('text')) {
        editor.insertNewline()
      // get first char from current line bullet scope and use it to prefix the new line
        const symbol = lineScopes.bullet.text.charAt(0)
        editor.insertText(symbol + ' ')
      }
      else {
        editor.deleteToBeginningOfWord()
        editor.outdentSelectedRows()
      }
    }
    else {
      editor.insertNewline()
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
    let loop = false
    if (!direction) {
      direction = 1
      loop = true
    }

    for (const [i, t] of tokens.entries()) {
      // check if option text exists on root scope and get its position
      if ((optIndex = rootScope.text.indexOf(t)) == -1) {
        continue;
      }
      // get range for token
      optIndex += rootScope.start.col
      tokenRange = [[row,  optIndex], [row, optIndex + t.length]]
      // check if the token found is last in the array
      if (i+direction >= 0 && i+direction < tokens.length) {
        nextValue = tokens[i+direction]
      }
      else { // last token in loop, remove it from line
        if (!loop) {
          continue
        }
        else if (cfg.emptyValue == false) {
          if (direction<0) { nextValue = tokens[tokens.length-1] }
          else { nextValue = tokens[0] }
        }
        else {
          //add spacer to range calculation
          if (cfg.spacer && cfg.spacer != "") { tokenRange[1][1] += cfg.spacer.length }
          nextValue = ""
        }
      }
    }
    // token not found, add first token in array to the line
    if (!tokenRange) {
      if (direction == -1) return;
      else if (scopes[cfg.contentScope]) {
        contentScope = scopes[cfg.contentScope]
        contentCol = contentScope.start.col
        if (cfg.insertAfter) contentCol = contentScope.end.col
        else contentCol = contentScope.start.col
      }
      else {
        contentCol = rootScope.end.col
      }
      tokenRange = [[row,contentCol], [row,contentCol]]
      nextValue = tokens[0] + cfg.spacer
    }
    if (nextValue != null) editor.setTextInBufferRange(tokenRange, nextValue)
  }
}

module.exports = { BufferUtils , BulletConf }


/* --------------------------------------------------------
  Common utility functions
*/

function get8601Date () {
  d = new Date()
  year = ("0000" + d.getFullYear()).substr(-4, 4)
  month = ("00" + (d.getMonth() + 1)).substr(-2, 2)
  day = ("00" + d.getDate()).substr(-2, 2)
  return "" + year + "-" + month + "-" + day
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
