# What Is Second Memory?

Second memory is a way to keep loose notes and journals inside of Atom editor, with markdown highlighting and some org-mode features.

## Usage

| Keystroke         | Behaviour                                                          |
|-------------------|--------------------------------------------------------------------|
| ctrl-1            | Create Heading                                                     |
| ctrl-2            | Create List                                                        |

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
| ctrl-space        | Create / update Org checkbox                                       |

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
