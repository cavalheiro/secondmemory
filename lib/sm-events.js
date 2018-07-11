'use babel'

import { Emitter } from 'atom'

const EventApi = {

  initialize: function() {
    return this.emitter = new Emitter
  },

  register: function (event, callback) {
    return this.emitter.on(event, callback)
  },

  fire: function (event, data) {
    this.emitter.emit(event, data)
  }

}

module.exports = { EventApi }
