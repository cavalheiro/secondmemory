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
| ctrl-shift-h      | Create Heading                                                     |
| ctrl-*            | Create List                                                        |
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
| shift-enter       | Create new sub-item                                                |
| ctrl-shift-t      | Create a Task from the list item                                   |
| ctrl->            | Toggle the Priority of a Task                                      |
| ctrl-shift-x      | Add a Checkbox to a list item                                      |
| ctrl-*            | Add a Star to a list item                                          |

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
    * [TODO] [>] My first task
    * [TODO] [>>] My first task
```

You can also create checkboxes in Task sub-items, by pressing `ctrl-shift-x` while positioned in a sub-item

```
    * [TODO] Test task 01
      - [ ] item 1
      - [x] item 2
```
*Pending Tasks (TODO items) will be displayed in the sidebar.*

## Motivation

I write lots of notes, about almost everything. Writing is a very important part of my work and of my organization in general. After trying several note taking tools and not being happy with any of them, I figured I had to start building my own.

## License

This project has been released under the MIT license. Please see the LICENSE.md file for more details.
