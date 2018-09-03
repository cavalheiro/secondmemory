'use babel'

import shell from 'shell'

const SMEditorView = {

  mouseLeaveHandler: function (e) {
    e.target.classList.remove("syntax--url-over")
  },

  mouseMoveHandler: function (e) {
    e.target.classList.add("syntax--url-over")
  },

  mouseDownHandler: function (e) {
    url = e.target.textContent
    shell.openExternal(url)
  },

  handleCtrlDown: function (editorView, event) {
    editorView.addEventListener('click', this.mouseDownHandler)
    var urls = editorView.querySelectorAll('.syntax--url')
    for(i=0; i<urls.length; i++) {
        urls[i].addEventListener('mousemove', this.mouseMoveHandler)
        urls[i].addEventListener('mouseleave', this.mouseLeaveHandler)
        urls[i].addEventListener('mouseclick', this.mouseDownHandler)
    }
  },

  handleCtrlUp: function (editorView, event) {
    editorView.removeEventListener('click', this.mouseDownHandler)
    var urls = editorView.querySelectorAll('.syntax--url')
    for(i=0; i<urls.length; i++) {
        urls[i].classList.remove("syntax--url-over")
        urls[i].removeEventListener('mousemove', this.mouseMoveHandler)
        urls[i].removeEventListener('mouseleave', this.mouseLeaveHandler)
        urls[i].removeEventListener('mouseclick', this.mouseDownHandler)
    }
  }
}

module.exports = { SMEditorView }
