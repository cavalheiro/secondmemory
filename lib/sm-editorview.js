'use babel'

import shell from 'shell'
import { BufferUtils } from './sm-buffer'

var lastKeyPress = null
var lastKeyPressTs = 0

const SMEditorView = {

  handleDoubleTap: function (e) {
    var ts = new Date().getTime()
    var interval = ts-lastKeyPressTs
    function stopPropagation() {
      e.preventDefault()
      e.stopPropagation()
    }
    if (lastKeyPress == e.code) {
      // trigger if Tab is pressed twice in less than 200 ms
      if (e.code == "Tab" && interval < 200) {
        BufferUtils.createElement()
        stopPropagation()
      }
    }
    // update control variables
    lastKeyPress = e.code
    lastKeyPressTs = ts
  },

  handleCtrlDown: function (editorView, event) {
    var urls = editorView.querySelectorAll('.syntax--url, .syntax--email, .syntax--mdlink1')
    for(i=0; i<urls.length; i++) {
        urls[i].addEventListener('mousemove', this.mouseMoveHandler)
        urls[i].addEventListener('mouseleave', this.mouseLeaveHandler)
        urls[i].addEventListener('click', this.mouseDownHandler)
    }
  },

  mouseLeaveHandler: function (e) {
    e.target.classList.remove('syntax--active-link')
  },

  mouseMoveHandler: function (e) {
    e.target.classList.add('syntax--active-link')
  },

  mouseDownHandler: function (e) {
    var url = e.target.textContent
    var isEmail = e.target.classList.contains('syntax--email')
    var isMarkdownLink = e.target.classList.contains('syntax--mdlink1')
    if (isEmail) {
      shell.openExternal('mailto:' + url)
    }
    else if (isMarkdownLink) {
      atom.workspace.open(url+'.md')
    }
    else {
      shell.openExternal(url)
    }
    editor = atom.workspace.getActiveTextEditor()
    editor.setCursorScreenPosition(editor.getCursorBufferPosition())
  },

  removeEditorViewEvents: function (editorView, event) {
    var urls = editorView.querySelectorAll('.syntax--url, .syntax--email, .syntax--mdlink1')
    for(i=0; i<urls.length; i++) {
        urls[i].classList.remove("syntax--active-link")
        urls[i].removeEventListener('mousemove', this.mouseMoveHandler)
        urls[i].removeEventListener('mouseleave', this.mouseLeaveHandler)
        urls[i].removeEventListener('click', this.mouseDownHandler)
    }
  }
}

module.exports = { SMEditorView }
