'use babel'

import shell from 'shell'
import { BufferUtils } from './sm-buffer'
import { Directory, File } from 'atom'

var lastKeyPress = null
var lastKeyPressTs = 0

const SMEditorView = {

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
    const url = e.target.textContent
    const isEmail = e.target.classList.contains('syntax--email')
    const isMarkdownLink = e.target.classList.contains('syntax--mdlink1')
    const editor = atom.workspace.getActiveTextEditor()
    if (isEmail) {
      shell.openExternal('mailto:' + url)
    }
    else if (isMarkdownLink) {
      // TODO:
      // Check if link is URL or local file
      // Add default extension (md) if is file no extension was
      file = new File(editor.getPath())
      // console.log(file.getParent())
      atom.workspace.open(file.getParent().getPath() + "/" + url)
    }
    else {
      shell.openExternal(url)
    }
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
