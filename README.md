**Hands-on** for atom
=================

**Hands-on** for atom puts navigation and control keys under the right hand, where it is normally located when typing. Therefore you can keep your hands in the same position even when performing navigation actions:

<img src=hands-on.svg/>

**Hands-on** mode is activated when you hold the modifier key right next to the spacebar. This can be <kbd>**AltGr**</kbd>, <kbd>**Meta**</kbd> or <kbd>☰</kbd> on different keyboards (all of these keys work). When the mode is active, some of the letters act as navigation keys. For instance, by pressing <kbd>**AltGr**+**L**</kbd> you move cursor one position up.

This is not just an additional key-binding (otherwise you would not need the **hands-on** package for that). Instead, **hands-on** actually simulates a keyboard event for the <kbd>↑</kbd> key. That is, all the commands bound to respective command keys will also work. For instance, you can press <kbd>**Ctrl**+**AltGr**+**K**</kbd> that will be treated as <kbd>**Ctrl**+↓</kbd> and invoke <kbd>Editor: Move Line Down</kbd>.



### Installation

Open **Settings** in Atom <kbd>**Ctrl**+**,**</kbd> and select **Install** section on the right side. Search for **hands-on** and click **Install** button.

Or with the command line:

```sh
$ apm install hands-on
```


### Desktop compatibility

Some key combinations can be taken over by your desktop environment (for instance, <kbd>**Ctrl**+**AltGr**+**L**</kbd> can lock the screen). In such cases, the keystrokes will not reach atom, of course. Disable or reassign such keystrokes in desktop settings if you wish to use them within atom.

Same applies to the <kbd>**AltGr**</kbd> key that on some layouts enables input of diatrical marks for the letters that follow. In this case, the <kbd>**AltGr**</kbd> keypress is taken over and does not reach atom. You can disable such layout features, or, if you wish to have those as well, use another key (<kbd>**Meta**</kbd> or <kbd>☰</kbd>) as **hands-on** mode activator.

---

I came into world of atom from emacs, and the main feature I have been missing so far was the opportunity to navigate without moving the hands away from their normal position (and therefore avoid briefly looking at the keyboard when puting them back in order to properly position).

The base navigation line layout <kbd>←</kbd> <kbd>↓</kbd> <kbd>↑</kbd> <kbd>→</kbd> was inspired by vim (never used it though, but it seems to be much more logical comparing to the one of emacs, that was based on the first letters of respective directions). The main navigation keys moved one position to the right eventually (in vim it starts with the <kbd>**H**</kbd> key). The reason for this is that the right <kbd>**Alt**</kbd> modifier is often located too far to the right, and the <kbd>**H**</kbd> was not that accessible when holding the modifier with a thumb.

---

Follow me on twitter: https://twitter.com/asvd0
