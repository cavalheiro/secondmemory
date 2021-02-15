# What Is Second Memory?

Second memory is a way to keep note cards and journals inside of Atom editor, with markdown highlighting and some org-mode features.

### Key maps

#### Main elements

| Keystroke         | Behaviour                                                          |
|-------------------|--------------------------------------------------------------------|
| ctrl-1            | Heading 1                                                          |
| ctrl-2            | Heading 2                                                          |
| ctrl-3            | Heading 3                                                          |
| ctrl-*            | Create List (if not exists)                                        |
| alt-q             | Create Quote                                                       |

#### Emphasis

| Keystroke         | Behaviour                                                          |
|-------------------|--------------------------------------------------------------------|
| alt-b             | Bold                                                               |
| alt-i             | Italic                                                             |
| alt-s             | Strikethrough                                                      |

#### Scope specific

When in a `Heading`

| Keystroke         | Behaviour                                                          |
|-------------------|--------------------------------------------------------------------|
| tab               | Increase Heading                                                   |
| shift-tab         | Decrease Heading                                                   |

When inside a `List`

| Keystroke         | Behaviour                                                          |
|-------------------|--------------------------------------------------------------------|
| tab               | Indent list item                                                   |
| shift-tab         | Outdent list item                                                  |
| enter             | Create new list item                                               |
| ctrl-S            | Star list item                                                     |
| ctrl-T            | Create TODO item                                                     |
| ctrl-alt-x        | Create / update Org checkbox                                       |

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
  - Item 1
    - sub-item 1
    - sub-item 2
      - yet another sub-item
  - Item 2
    - sub-item 1
    - sub-item 2
```

### Org-mode checkboxes

```
  * [ ] To do
  * [/] In progress
  * [o] blocked
  * [>] postponed (date)
  * [x] done
  * [-] canceled
  * [<] done before
```

## License

This project has been released under the MIT license. Please see the LICENSE.md file for more details.
