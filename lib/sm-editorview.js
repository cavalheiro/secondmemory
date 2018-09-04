'use babel'

import shell from 'shell'

const SMEditorView = {

  mouseLeaveHandler: function (e) {
    e.target.classList.remove('syntax--active-link')
  },

  mouseMoveHandler: function (e) {
    e.target.classList.add('syntax--active-link')
  },

  mouseDownHandler: function (e) {
    var url = e.target.textContent
    var isEmail = e.target.classList.contains('syntax--email')
    console.log(url, isEmail)
    if (isEmail) {
      shell.openExternal('mailto:' + url)
    }
    else {
      shell.openExternal(url)
    }
  },

  handleCtrlDown: function (editorView, event) {
    var urls = editorView.querySelectorAll('.syntax--url, .syntax--email')
    for(i=0; i<urls.length; i++) {
        urls[i].addEventListener('mousemove', this.mouseMoveHandler)
        urls[i].addEventListener('mouseleave', this.mouseLeaveHandler)
        urls[i].addEventListener('click', this.mouseDownHandler)
    }
  },

  handleCtrlUp: function (editorView, event) {
    var urls = editorView.querySelectorAll('.syntax--url, .syntax--email')
    for(i=0; i<urls.length; i++) {
        urls[i].classList.remove("syntax--active-link")
        urls[i].removeEventListener('mousemove', this.mouseMoveHandler)
        urls[i].removeEventListener('mouseleave', this.mouseLeaveHandler)
        urls[i].removeEventListener('click', this.mouseDownHandler)
    }
  }
}

module.exports = { SMEditorView }
