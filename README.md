# Tile Tooltip Journal
![Foundry Version](https://img.shields.io/badge/Foundry-v13-green)
![License](https://img.shields.io/badge/license-GPL%203.0-blue)
[![Install Module](https://img.shields.io/badge/Foundry-Install%20Module-orange)](manifest-url)

A Foundry v13 module to display fade in/out tooltips on tiles using content pulled directly from Journal Entries or Journal Pages.

This can be used for environmental descriptions, map lore, reminders, making maps more interactive, and probably a lot more.

Tile tooltips are triggered by mouse over/hover.  Tooltip content is pulled from Journal Entries or Journal Pages and players do not need journal permissions.  Does not conflict and works alongside Monk's Active Tile Triggers ((MATT)), system agnostic, tooltips display only when the 'Token Control' layer is active.


---
 Installation

Install via Foundry module.json.  This is the recommended method or by searching Foundry's built in package manager once submitted and approved.  Copy the link below ((links to the most current release)) or go to the releases page for the current release and then paste that into Foundry's 'Install Module' window.

```
https://github.com/devastatorx/tile-journal-tooltips/releases/latest/download/module.json
```
---

Preview

![Tooltip Demo](/images/showcase.gif)

---

Limitations

Currently the module only supports text from Journals.  I am planning on adding image support and support for the various Journal Page types.

---

Usage

After enabling the module:

1. Select 'Tile Controls' on the left toolbar
2. Place or select a tile
3. Open the settings window for the tile
4. Navigate to the 'Tooltip' tab

![Tooltip Settings](/images/1.png)

![Tooltip Configuration](/images/2.png)

5. Enable the tooltip by checking 'Enable Tooltip'

![Enable Tooltip](/images/3.png)

6. Select a Journal Entry
7. Optionally select a Journal Page from the selected Journal Entry
8. Save and apply the changes, this should update the 'Cache Status' with a date and time stamp.

---

Settings

Enable Tooltip - activates tooltip functionality for the tile.

Journal Entry (Source) - select the Journal Entry used as the tooltip source.  Players **do not need permissions** to this journal.

Journal Page - if the journal contains multiple pages you may select a specific page.  If no page is selected the first page of the selected Journal Entry is used.  If no pages exist the Journal Entry content is used.

Cache Status - when the tile is saved the journal content is cached to the tile and a timestamp shows when the cache was last created.  By caching the journal to the tile, players do not need permissions to the journals used to create any tooltips.  If the journal entry changes, such as updating information in the selected page/entry **you must re-cache the tooltip**

---

Known Issues

Sometimes, when creating a tile tooltip for the first time caching may fail (no date and timestamp displayed for 'Cache Status')

If caching fails:

1. Click 'Apply' or 'Update Tile'
2. Reopen the tile settings
3. Go back to 'Tooltip' tab
4. Apply again
If the 'Cache Status' shows a timestamp, it worked.

Tooltips will likely appear if the mouse cursor hovers a tile even when that tile is behind another window, such as a character sheet, item sheet, any other open window. Should be fixed in the next release.

If a tooltip is visible while switching scenes it may remain visible on the newly loaded scene.  In this case, moving the mouse over the right sidebar should cause it to fade out.  Should be fixed in the next release

---

This project is licensed under GPL 3.0