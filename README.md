# What Is Second Memory?

Second memory is a way to keep loose notes, journals and TODO lists inside of Atom editor.
All text is written in **plain markdown** and you can structure your documents in whatever way you want.

![SM Screenshot](https://github.com/cavalheiro/secondmemory/raw/master/screenshots/sm-0.1.0.png)

**Base features include**

  - Markdown grammar with syntax highlighting
  - TODO concept, with priorities
  - Smart labels
  - Sidebar, currently used only for tasks

## Usage

| Keystroke         | Behaviour                                                          |
|-------------------|--------------------------------------------------------------------|
| ctrl-\|           | Toggle Sidebar visibility                                          |
| ctrl-tab          | Create List / Heading                                              |
| ctrl-i d          | Insert the current date in ISO-8601 format                         |

When in a `Heading`

| Keystroke         | Behaviour                                                          |
|-------------------|--------------------------------------------------------------------|
| tab               | Increase Heading                                                   |
| shift-tab         | Decrease Heading                                                   |

When in a `List`

| Keystroke         | Behaviour                                                          |
|-------------------|--------------------------------------------------------------------|
| tab               | Indent selected items                                              |
| shift-tab         | Outdent selected items                                             |
| enter             | Create new item                                                    |
| ctrl-shift-t      | Create a Task from the list item                                   |
| ctrl->            | Toggle the Priority of a Task                                      |

## Examples

### Headings

When selection is a heading, `tab` and `shift-tab` will decrease / increase heading size

Press `tab` to decrease heading size:

```
    # Heading -> ## Heading -> ### Heading
```

or `shift-tab` to increase heading level:

```
    ### Heading -> ## Heading -> # Heading
```

### Lists

Lists are lines that start with a `*` or a `-`, and list items must follow a correct identation, as per markdown standard.

```
  * Item 1
    - sub-item 1
    - sub-item 2
      - yet another sub-item
  * Item 2
    - sub-item 1
    - sub-item 2
```

#### Tasks

To create a Task, select a List item and press `ctrl-shift-t`

```
    * [TODO] My first task
```

To change the Priority of a Task, press `ctrl->`

```
    * [TODO] #> My first task
    * [TODO] #>> My first task
```
*Pending Tasks (TODO items) will be displayed in the sidebar.*

## Motivation

# I write lots of notes. Writing is a very important part of my work and of my organization in general.

## License

This project has been released under the MIT license. Please see the LICENSE.md file for more details.
