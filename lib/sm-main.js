'use babel'

import { CompositeDisposable } from 'atom'
import SMIndex from './sm-index'
import { BufferUtils, BulletConf } from './sm-buffer'
import { EventApi } from './sm-events'
import SMView from './sm-view'

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

    // Create sidebar view
    sidebar = new SMView()

    // Register event listeners
    subscriptions.add(EventApi.initialize())
    EventApi.register('index-complete', () => sidebar.populateTasks(smIndex.index.tasks)),
    EventApi.register('index-build', () => smIndex = new SMIndex())

    // Trigger index creation
    EventApi.fire('index-build')

    // Listen for file save events
    atom.workspace.observeTextEditors((editor) => {
      if (editor.getGrammar().scopeName == 'source.secondmemory')
        subscriptions.add(editor.onDidSave( (f) => smIndex.reIndexFile(f.path)))
    })

    // Add command subscriptions
    subscriptions.add(
      atom.commands.add('atom-text-editor', { 'sm:toggleSidebar': (event) => sidebar.toggleVisibility() }),
      atom.commands.add('atom-text-editor', { 'sm:toggleCheckbox': (event) => BufferUtils.rotLabel(BulletConf.checkbox) }),
      atom.commands.add('atom-text-editor', { 'sm:increaseHeading': (event) => BufferUtils.rotLabel(BulletConf.heading, 1) }),
      atom.commands.add('atom-text-editor', { 'sm:decreaseHeading': (event) => BufferUtils.rotLabel(BulletConf.heading, -1) }),
      atom.commands.add('atom-text-editor', { 'sm:toggleStar': (event) => BufferUtils.rotLabel(BulletConf.star) }),
      atom.commands.add('atom-text-editor', { 'sm:toggleTask': (event) => BufferUtils.rotLabel(BulletConf.todo) }),
      atom.commands.add('atom-text-editor', { 'sm:togglePriority': (event) => BufferUtils.rotLabel(BulletConf.priority) }),
      atom.commands.add('atom-text-editor', { 'sm:newBulletLine': (event) => BufferUtils.newBulletLine() }),
      atom.commands.add('atom-text-editor', { 'sm:newBulletSub': (event) => BufferUtils.newBulletSub() }),
      atom.commands.add('atom-text-editor', { 'sm:indent': (event) => BufferUtils.indent() }),
      atom.commands.add('atom-text-editor', { 'sm:unindent': (event) => BufferUtils.unindent() }),
      atom.commands.add('atom-text-editor', { 'sm:insertDate': (event) => BufferUtils.insert8601Date() }),
      atom.commands.add('atom-text-editor', { 'sm:insertTimelineDate': (event) => BufferUtils.insertTimelineDate() })
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
