'use babel'

import { CompositeDisposable } from 'atom'
import { SMIndex } from './sm-index'
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
    const smView = new SMView()
    modal = atom.workspace.addRightPanel({
      item: smView.getElement(),
      visible: true
    })

    // Register event handlers
    EventApi.register('refresh-tasks', () => smView.populateTasks(SMIndex.index.tasks))

    // Build index
    SMIndex.build([(index) => EventApi.fire('refresh-tasks')])


    subscriptions.add(
      // Commands
      atom.commands.add('atom-text-editor', { 'sm:toggleCheckbox': (event) => BufferUtils.rotLabel(BulletConf.checkbox) }),
      atom.commands.add('atom-text-editor', { 'sm:increaseHeading': (event) => BufferUtils.rotLabel(BulletConf.heading, 1) }),
      atom.commands.add('atom-text-editor', { 'sm:decreaseHeading': (event) => BufferUtils.rotLabel(BulletConf.heading, -1) }),
      atom.commands.add('atom-text-editor', { 'sm:insert-star': (event) => BufferUtils.rotLabel(BulletConf.star) }),
      atom.commands.add('atom-text-editor', { 'sm:changeStatus': (event) => BufferUtils.rotLabel(BulletConf.todo) }),
      atom.commands.add('atom-text-editor', { 'sm:changeUrgency': (event) => BufferUtils.rotLabel(BulletConf.priority) }),
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
    subscriptions.dispose()
  }
}
