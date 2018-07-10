'use babel'

import { Directory, File } from 'atom'

const fileFilter = '.md'

const scopeParsers = [

  /* Check if the input scope list contains a task and parses it */
  (index, file, line, scopes) => {
    indexAs = 'tasks'
    if (scopes['task']) {
      if (!index[indexAs]) index[indexAs] = []
      result = {
        priority: (function (s) {
          if (s['label.priority2']) return 2;
          else if (s['label.priority1']) return 1;
          else return 0;
        })(scopes),
        text: scopes['text'],
        file: file.getPath(),
        line: line
      }
      index[indexAs].push(result)
    }
  }
]

const SMIndex = {

  grammar: null,
  index: {},
  pList: [],

  /**
   * Processes tokens found the a file and get the scopes of each line
   * The idea is to apply scope parsers to each line to extract relevant metadata
   */
  parseFileContents: function(file) {
    contentsPromise = file.read()
    p = new Promise((resolve, reject) => {
      contentsPromise.then(fc => {
        line = 0
        grammar.tokenizeLines(fc).forEach((lineTokens) => {
          scopes = {}
          for(scopeGroup of lineTokens) {
            for(s of scopeGroup.scopes) {
              if (!scopes[s]) scopes[s] = scopeGroup.value
              else scopes[s] += scopeGroup.value
            }
          }
          scopeParsers.forEach( (f) => f(this.index, file, line, scopes))
          line++
        })
        resolve(file)
      })
    })
    return p
  },

  parseDirectoryEntry: function (dirContent) {
    dirContent.forEach((entry, idx) => {
      if (entry.getBaseName().startsWith('.')) return
      if (entry instanceof Directory) {
        this.parseDirectoryEntry(entry.getEntriesSync())
      }
      else {
        fileName = entry.getBaseName()
        if (fileName.includes(fileFilter)) {
          this.pList.push(this.parseFileContents(entry))
        }
      }
    })
  },

  build: function (callbacks) {
    console.time("buildindex");
    packagePath = atom.packages.resolvePackagePath("secondmemory")
    smGrammarLocation = packagePath + "/grammars/sm-markdown.cson"
    grammar = atom.grammars.readGrammarSync(smGrammarLocation)
    let paths = atom.project.getPaths()
    paths.forEach((val,index) => this.parseDirectoryEntry(new Directory(val).getEntriesSync()))

    Promise.all(this.pList).then(rs => {
     console.log(this.index)
     callbacks.forEach( (f) => f(this.index) )
     console.timeEnd("buildindex");
    })
  }
}

module.exports = { SMIndex }
