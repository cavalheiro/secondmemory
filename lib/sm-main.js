'use babel'

import SMIndex from './sm-index'
import SMSidebar from './sm-sidebar'
import { CompositeDisposable } from 'atom'
import { BufferUtils, BulletConf } from './sm-buffer'
import { EventApi } from './sm-events'
import { SMEditorView } from './sm-editorview'

subscriptions = null
sidebar = null

module.exports = {
  levelStyle: 'spaces',
  indentSpaces: 2,

  config: {
    testSetting: {
      type: 'array',
      title: 'Test setting',
      description: 'A list of partial file names to skip',
      default: ['txt', 'ext'],
      items: {
        type: 'string'
      }
    }
  },

  activate: function (state) {
    subscriptions = new CompositeDisposable()

    // Create views
    sidebar = new SMSidebar()

    // Register event listeners
    subscriptions.add(EventApi.initialize())
    EventApi.register('index-complete', () => {
      sidebar.populateTasks(smIndex.index.tasks)
      sidebar.populateStars(smIndex.index.stars)
    })
    EventApi.register('index-build', () => smIndex = new SMIndex())

    // Trigger index creation
    EventApi.fire('index-build')

    // Listen for file save events
    atom.workspace.observeTextEditors((editor) => {
      if (editor.getGrammar().scopeName == 'source.secondmemory')
        // Handle CTRL (meta-click) behaviour
        var editorView = atom.views.getView(editor)
        if (editorView != null) {
          editorView.addEventListener('keydown', (e) => { if (e.code === "ControlLeft") SMEditorView.handleCtrlDown(editorView) } )
          editorView.addEventListener('keyup', (e) => { if (e.code === "ControlLeft") SMEditorView.handleCtrlUp(editorView) } )
        }
        subscriptions.add(editor.onDidSave( (f) => smIndex.reIndexFile(f.path) ))
      })

    // Add command subscriptions
    subscriptions.add(
      atom.commands.add('atom-text-editor', { 'sm:toggleSidebar': (event) => sidebar.toggleVisibility() }),
      atom.commands.add('atom-text-editor', { 'sm:toggleCheckbox': (event) => BufferUtils.rotLabel(BulletConf.checkbox) }),
      atom.commands.add('atom-text-editor', { 'sm:toggleTask': (event) => BufferUtils.rotLabel(BulletConf.todo) }),
      atom.commands.add('atom-text-editor', { 'sm:toggleStatus': (event) => BufferUtils.rotLabel(BulletConf.status) }),
      atom.commands.add('atom-text-editor', { 'sm:toggleStar': (event) => BufferUtils.rotLabel(BulletConf.star) }),
      atom.commands.add('atom-text-editor', { 'sm:newLine': (event) => BufferUtils.newLine() }),
      atom.commands.add('atom-text-editor', { 'sm:indent': (event) => BufferUtils.indent() }),
      atom.commands.add('atom-text-editor', { 'sm:outdent': (event) => BufferUtils.outdent() }),
      atom.commands.add('atom-text-editor', { 'sm:createList': (event) => BufferUtils.createList() }),
      atom.commands.add('atom-text-editor', { 'sm:insertDate': (event) => BufferUtils.insert8601Date() }),
      atom.commands.add('atom-text-editor', { 'sm:toggleProgress': (event) => BufferUtils.rotLabel(BulletConf.progress) })
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
