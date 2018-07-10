'use babel'

import { Emitter } from 'atom'

emitter = new Emitter

const EventApi = {

  register: function (event, callback) {
    emitter.on(event, callback)
  },

  fire: function (event, data) {
    emitter.emit(event, data)
  }

}

module.exports = { EventApi }
