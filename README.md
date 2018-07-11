# What Is Second Memory?

Second memory is a way to keep loose notes, journals and TODO lists inside of Atom editor.
All text is written in **plain markdown** and you can structure your documents in whatever way you want.

**Base features include**

  - Markdown grammar with syntax highlighting
  - TODO concept, with priorities
  - Smart labels
  - Sidebar, currently used only for tasks

## Usage

### Keymap

| Keystroke   | Behaviour                                                           |
| ------------| ------------------------------------------------------------------- |
| ctrl-\|     |  Toggle sidebar visibility                                          |
| tab         |  Small heading / Indent selected lines                              |
| shift-tab   |  Bigger heading / Outdent selected lines                            |
| enter       |  Create a new bullet line                                           |
| shift-enter |  Create a new bullet line sub-item                                  |
| ctrl-i d    |  Insert the current date in ISO-8601 format                         |
| ctrl-T      |  Mark bullet line as a task. Tasks will be displayed on the sidebar |
| ctrl->      |  Toggle the priority of a task                                      |
| ctrl-X      |  Add a checkbox to a bullet line                                    |
| ctrl-*      |  Star the selected bullet line                                      |

## Examples

#### Headings

When positioned in a heading, `tab` and `shift-tab` will decrease / increase heading size

Press `tab` to decrease heading size:

```
    # Heading -> ## Heading -> ### Heading
```

or `shift-tab` to increase heading level:

```
    ### Heading -> ## Heading -> # Heading
```

#### Bullets

Bullets are lines that start with a `*` or a `-`.
Blocks of bullets must follow a correct identation, as per markdown standards. Example:

```
  * Bullet 1
    - sub-item 1
    - sub-item 2
      - yet another sub-item
  * Bullet 2
    - sub-item 1
    - sub-item 2
```

#### Tasks

Bullets can be transformed in tasks. Pending tasks will be displayed in the sidebar.
To create a task, move the cursor to a bullet line and press ctrl-T:

```
    * [TODO] My first task
```

To change the priority of a task, move the cursor to the task line, and press `ctrl->`:

```
    * [TODO] [>] My first task
    * [TODO] [>>] My first task
```

You can also create task sub-items with checkboxes:

```
    * [TODO] Test task 01
      - [ ] item 1
      - [x] item 2
```

Please note there is currently no automation in place. Tasks will not be automatically closed when all boxes are checked.

## Motivation

I write lots of notes, about almost everything. Writing is a very important part of my work and of my organization in general. After trying several note taking tools and not being happy with any of them, I figured I had to start building my own.

## License

This project has been released under the MIT license. Please see the LICENSE.md file for more details.
