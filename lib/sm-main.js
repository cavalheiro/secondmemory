'use babel'

import SMTree from './sm-tree'
import SMSidebar from './sm-sidebar'
import { CompositeDisposable } from 'atom'
import { BufferUtils, SymbolConf } from './sm-buffer'
import { SMEditorView } from './sm-editorview'

subscriptions = null
sidebar = null

module.exports = {

  activate: function (state) {
    subscriptions = new CompositeDisposable()

    smTree = new SMTree()

    // Listen for file save events
    atom.workspace.observeTextEditors((editor) => {
      if (editor.getGrammar().scopeName == 'source.secondmemory')
        var editorView = atom.views.getView(editor)
        if (editorView != null) {
          editorView.addEventListener('keydown', (e) => {
            // Handle Ctrl (hyperlinks) and double tabs on 'enter' and 'tab'
            if (e.code === "ControlLeft") SMEditorView.handleCtrlDown(editorView)
            // else SMEditorView.handleDoubleTap(e)
          })
          editorView.addEventListener('keyup', (e) => {
            if (e.code == "ControlLeft") SMEditorView.removeEditorViewEvents(editorView)
          })
          window.addEventListener("blur", (e) => SMEditorView.removeEditorViewEvents(editorView) )
        }
        subscriptions.add(editor.onDidSave( (f) => smTree.reCheckFile(f.path) ))
      })

    // Add command subscriptions
    subscriptions.add(
      atom.commands.add('atom-text-editor', { 'sm:toggleCheckbox': (event) => BufferUtils.rotLabel(SymbolConf.checkbox) }),
      atom.commands.add('atom-text-editor', { 'sm:strikethrough': (event) => BufferUtils.toggleEmphasis("strikethrough") }),
      atom.commands.add('atom-text-editor', { 'sm:bold': (event) => BufferUtils.toggleEmphasis("bold") }),
      atom.commands.add('atom-text-editor', { 'sm:italic': (event) => BufferUtils.toggleEmphasis("italic") }),
      atom.commands.add('atom-text-editor', { 'sm:newLine': (event) => BufferUtils.newLine() }),
      atom.commands.add('atom-text-editor', { 'sm:indent': (event) => BufferUtils.indent() }),
      atom.commands.add('atom-text-editor', { 'sm:outdent': (event) => BufferUtils.outdent() }),
      atom.commands.add('atom-text-editor', { 'sm:createList': (event) => BufferUtils.createList() }),
      atom.commands.add('atom-text-editor', { 'sm:createHeading': (event) => BufferUtils.createHeading() }),
      atom.commands.add('atom-text-editor', { 'sm:createQuote': (event) => BufferUtils.createQuote() }),
      atom.commands.add('atom-text-editor', { 'sm:insertDate': (event) => BufferUtils.insertDate() }),
      atom.commands.add('atom-text-editor', { 'sm:insertDateLong': (event) => BufferUtils.insertDateLong() }),
      atom.commands.add('atom-text-editor', { 'sm:star': (event) => BufferUtils.rotLabel(SymbolConf.star) }),
      atom.commands.add('atom-text-editor', { 'sm:insertLineBefore': (event) => BufferUtils.insertBlankLine('before') }),
      atom.commands.add('atom-text-editor', { 'sm:insertLineAfter': (event) => BufferUtils.insertBlankLine('after') }),
      atom.commands.add('atom-text-editor', { 'sm:todo': (event) => BufferUtils.rotLabel(SymbolConf.todo) }),
    )
  },

  // Hyperclick provider
  // getProvider: function () {
  //   return HyperClick.getProvider();
  // },

  deactivate: function () {
    sidebar.destroy()
    subscriptions.dispose()
  }
}
