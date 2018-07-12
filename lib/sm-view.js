'use babel'

import { CompositeDisposable } from 'atom'
import { EventApi } from './sm-events'

const Templates = {
  taskList: `
    <div class="sm-panel">
      <div class="sm-panel-resize-handle"></div>
      <div class="sm-panel-todo">
        <div class="sm-panel-todo-header">
          <span class="todo-title-icon icon-checklist"></span>
          <span class="todo-title">Tasks</span>
          <span class="refresh-button icon icon-sync"></span>
        </div>
        <div class="sm-panel-todo-items">
          <ul class="sm-panel-todo-list">
          </ul>
        </div>
      </div>
    </div>`,

  taskItem:`
    <li>
      <a class='task-checkbox icon icon-primitive-square'></a>
      <span class="task-priority icon"></span>
      <a class='task-text'></a>
    </li>`
}

// Simple DOM handling toolkit - we don't need Jquery
function parseHTML(str) {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  return tmp.body.children[0];
}

function $(expr, content) {
  if (content) return content.querySelectorAll(expr)[0]
  else return document.querySelectorAll(expr)[0]
}

// Second Memory View class, w/ resize support
export default class SMView  {

  constructor () {
    content = parseHTML(Templates.taskList)
    $('.refresh-button', content).addEventListener('click', this.refresh)
    $('.sm-panel-resize-handle', content)
      .addEventListener('mousedown', e => {
        document.addEventListener('mousemove', this.resize)
        document.addEventListener('mouseup', e => {
          document.removeEventListener('mousemove', this.resize)
        })
      })
    this.view = atom.workspace.addRightPanel({
      item: content,
      visible: true
    })

  }

  /** Gets an array of task items and populates the panel */
  populateTasks (tasks) {
    let root = $('.sm-panel-todo-list')
    while (root.firstChild) root.removeChild(root.firstChild) // clean up
    if (!tasks) return // nothing to do
    const tmpl = parseHTML(Templates.taskItem)
    tasks.sort((a, b) => {
      nameOrder = ((a, b) => {
        if (a>b) return 1
        else if (a<b) return -1
        else return 0
      })(a.text, b.text)
      return 1E2 * (b.priority - a.priority) + 1E1 * nameOrder
    })
    tasks.forEach( (task) => {
      el = tmpl.cloneNode(true)
      el.dataset.file = task.file
      el.dataset.line = task.line
      $('.task-checkbox', el).addEventListener('click', (e) => this.todoCheck(e))
      $('.task-text', el).addEventListener('click', (e) => this.todoClick(e))
      $('.task-text', el).text = task.text
      if (task.priority) $('.task-priority', el).classList.add('icon-arrow-up')
      if (task.priority == 1) $('.task-priority', el).style.color = "orange"
      if (task.priority == 2) $('.task-priority', el).style.color = "red"
      root.appendChild(el)
    })
  }

  /** Jump to the file where the clicked task item is */
  todoClick (e) {
    ({file, line} = e.target.parentNode.dataset)
    options = {
      initialLine: 1*line,
      initialColumn: 10,
      pending: true
    }
    return atom.workspace.open(file, options)
  }

  /** Check the selected task item (mark as done) */
  todoCheck (e) {
    $('.task-checkbox', el).classList.add
    this.todoClick(e).then( (editor) => {
      textEditorView = atom.views.getView(editor)
      atom.commands.dispatch(textEditorView, "sm:toggleTask")
    })
    e.target.className = 'icon icon-check'
    setTimeout(() => { e.target.parentNode.remove() }, 1000);
  }

  refresh (e) {
    EventApi.fire('index-build')
  }

  toggleVisibility () {
    if (this.view.isVisible()) this.view.hide()
    else this.view.show()
  }

  /* Handle sidebar resize */
  resize (e) {
    el = $('.sm-panel')
    offsetLeft = el.getBoundingClientRect().left
    newWidth = el.offsetWidth + offsetLeft - e.pageX
    el.style.width = newWidth + 'px'
  }

  destroy () {
    this.view.destroy();
  }

}
