# Tile Tooltip Journal
![Foundry Version](https://img.shields.io/badge/Foundry-v13-green)
![License](https://img.shields.io/badge/license-GPL%203.0-blue)
[![Install Module](https://img.shields.io/badge/Foundry-Install%20Module-orange)](manifest-url)

Display fade in/out tooltips on tiles using content pulled directly from Journal Entries or Journal Pages.

This can be used for environmental descriptions, map lore, reminders, making maps more interactive, and probably a lot more.

---

# Installation

### Install via Foundry

This is the recommended method.
Copy the link below ((links to the most current release)) and right click on module.json for the current release and then paste that into Foundry's 'Install Module' window.

```
https://github.com/devastatorx/tile-journal-tooltips/releases/latest/download/module.json
```

Foundry → Add-on Modules → Install Module → Paste URL

---

# Preview

![Tooltip Demo](/images/showcase.gif)

Hovering a tile displays a **fade-in tooltip** pulled from a journal entry.

---

# Features

* Tile tooltips triggered by mouse over/hover
* Fade in and fade out
* Tooltip content is pulled content from Journal Entries or Journal Pages
* Players do not need journal permissions
* Prevents story spoilers
* Does not conflict and works alongside Monk's Active Tile Triggers ((MATT))
* System agnostic
* Tooltips display only when the Token Control layer is active

---

# Limitations

Currently the module only supports text from Journals.  I am planning on adding image support and support for the various Journal Page types.

---

# Planned Features

- [ ] Journal image support
- [ ] Tooltip themes
- [ ] Custom styling through either css or via the Tooltip configuration interface
- [ ] Support for various Journal Page types

---

# Usage

After enabling the module:

1. Select Tile Controls
2. Place or select a tile
3. Open the settings window for the tile
4. Navigate to the 'Tooltip' tab

![Tooltip Settings](/images/1.png)

![Tooltip Configuration](/images/2.png)

---

# Enabling Tooltips

Enable the tooltip by checking 'Enable Tooltip'

![Enable Tooltip](/images/3.png)

---

# Settings

## Enable Tooltip

Activates tooltip functionality for the tile.

---

## Journal Entry (Source)

Select the Journal Entry used as the tooltip source.

Players **do not need permissions** to this journal.

---

## Journal Page

If the journal contains multiple pages you may select a specific page.

If no page is selected the first page of the selected Journal Entry is used.  If no pages exist the Journal Entry content is used.

---

## Cache Status

When the tile is saved the journal content is cached to the tile.

A timestamp shows when the cache was last created.

Caching allows tooltips to display without journal permissions granted to players.

### Important

If the journal entry changes **you must re-cache the tooltip**

---

# Known Issues

<details>
<summary>Initial tooltip caching may fail</summary>

Ensure the tile has a name set in the 'Appearance' tab

If caching fails:

1. Click 'Apply' or 'Update Tile'
2. Reopen the tile settings
3. Go back to 'Tooltip' tab
4. Apply again

If the 'Cache Status' shows a timestamp, it worked.

</details>

---

<details>
<summary>Tooltips appear through open windows</summary>

Tooltips may appear while hovering tiles even if another window is open.

Fix planned.

</details>

---

<details>
<summary>Tooltip persists after scene change</summary>

If a tooltip is visible while switching scenes it may remain visible on the newly loaded scene.

Moving the mouse over the right sidebar should cause it to fade out.

Fix planned.

</details>

---

# Compatibility

 Foundry v13

---

# License

This project is licensed under **GPL 3.0**.

See:

LICENSE