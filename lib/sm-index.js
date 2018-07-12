'use babel'

import { Directory, File } from 'atom'
import { EventApi } from './sm-events'

const fileFilter = '.md'

/*
 * An array of scope parsers used to identify and index labels
 */
const scopeParsers = [
  /* Tasks (TODOs) */
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


/*
 * Process all the files in a given Directory
 * to be called by the constructor only
 */
function parseDirectoryEntry (dirEntries, index, pList) {
  dirEntries.forEach((entry) => {
    if (entry.getBaseName().startsWith('.')) return
    if (entry instanceof Directory) {
      parseDirectoryEntry(entry.getEntriesSync(), index, pList)
    }
    else {
      fileName = entry.getBaseName()
      if (fileName.includes(fileFilter)) {
        pList.push(parseFileContents(entry, index))
      }
    }
  })
}

/**
 * Processes tokens found the a file and get the scopes of each line
 * The idea is to apply scope parsers to each line to extract relevant metadata
 */
function parseFileContents (file, index) {
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
        scopeParsers.forEach( (f) => f(index, file, line, scopes))
        line++
      })
      resolve(file)
    })
  })
  return p
}

export default class SMIndex  {

  grammar = null
  index = {}
  pList = []
  reindexQueue = {}

  constructor () {
    console.time("buildindex");
    packagePath = atom.packages.resolvePackagePath("secondmemory")
    smGrammarLocation = packagePath + "/grammars/sm-markdown.cson"
    grammar = atom.grammars.readGrammarSync(smGrammarLocation)
    let paths = atom.project.getPaths()
    paths.forEach((path) => parseDirectoryEntry(new Directory(path).getEntriesSync(), this.index, this.pList))
    Promise.all(this.pList).then(rs => {
     console.log(this.index)
     // callbacks.forEach( (f) => f(this.index) )
     EventApi.fire('index-complete')
     console.timeEnd("buildindex");
    })
  }

  /*
  * Re-index a given file (usually called after a save)
  */
  reIndexFile (path) {
    // avoid clashing of events when same file is open in multiple tabs
    if (this.reindexQueue[path]) return
    this.reindexQueue[path] = true
    console.time("reindex-file");
    // remove file occurrences in index
    Object.keys(this.index).forEach( (key) => {
      this.index[key] = this.index[key].filter( o => o.file != path);
    })
    const file = new File(path)
    parseFileContents(file, this.index).then(() => {
      delete this.reindexQueue[path]
      EventApi.fire('index-complete')
    })
    console.timeEnd("reindex-file");
  }
}
