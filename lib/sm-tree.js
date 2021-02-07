'use babel'

import { Directory, File } from 'atom'
import path from 'path'

const fileFilter = '.md'

/*
 * Process all the files in a given Directory
 * to be called by the constructor only
 */
function parseDirectoryEntry (dirEntries, pList) {
  skip = false 
  dirEntries.forEach((entry) => {
    if (entry.getBaseName().startsWith('.noindex')) skip = true
  })
  if (!skip) dirEntries.forEach((entry) => {
    if (entry.getBaseName().startsWith('.')) return
    if (entry instanceof Directory) {
      parseDirectoryEntry(entry.getEntriesSync(), pList)
    }
    else {
      fileName = entry.getBaseName()
      if (fileName.includes(fileFilter)) {
        pList.push(parseFileContents(entry, true))
      }
    }
  })
}

/**
 * Check if there are any TODO elements in the file
 */
function parseFileContents (file, initialScan = false) {
  contentsPromise = file.read()
  p = new Promise((resolve, reject) => {
    contentsPromise.then(fc => {
      if (-1 != fc.search("TODO:")) highlightFileinTree(file, true)
      else if (!initialScan) highlightFileinTree(file, false)
      resolve(file)
    })
  })
  return p
}

/**
 * Mark a file in the tree in red color 
 * if mark == false removes the color 
 * expand the tree as needed
 */
function highlightFileinTree (file, mark) {
  hashCode = function(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
  }
  sid = "smtree-"+hashCode(file.path)
  styleEl = document.getElementById(sid)
  if (!mark) {
    console.log(document.head)
    el = document.getElementById(sid)
    if (el) el.remove()
  } else {
    rp = atom.project.relativizePath(file.path)
    rootPath = rp[0]
    relativePath = rp[1]
    activePathComponents = relativePath.split(path.sep)
    activePathComponents.unshift(rootPath.substr(rootPath.lastIndexOf(path.sep) + 1))
    currentPath = rootPath.substr(0, rootPath.lastIndexOf(path.sep))
    activePathComponents.forEach((pathComponent) => {
      currentPath += path.sep + pathComponent
      entry = treeview.entryForPath(currentPath)
      if (entry.classList.contains('directory')) entry.expand()
      else if (!styleEl) {
        const style = document.createElement('style');
        style.innerHTML = `
        span.name.icon.icon-file-text[title='`+file.getBaseName()+`'] {
          color: tomato;
        }`;
        style.id = sid
        document.head.appendChild(style);
      }
    });
  }
}


export default class SMTree  {
  treeview = null
  pList = []

  constructor () {
    console.time("buildindex");
    atom.workspace.observePaneItems((pane) => {
      if (pane.constructor.name == "TreeView") {
        treeview = pane 
        let paths = atom.project.getPaths()
        paths.forEach((path) => parseDirectoryEntry(new Directory(path).getEntriesSync(), this.pList))
      }
    })
    Promise.all(this.pList).then(rs => {
     console.timeEnd("buildindex");
    })
  }

  /*
  * Re-index a given file (usually called after a save)
  */
  reCheckFile (path) {
    console.time("recheck-file");
    const file = new File(path)
    parseFileContents(file).then(() => {
    })
    console.timeEnd("recheck-file");
  }
}
