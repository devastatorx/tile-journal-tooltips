# Tile Tooltip Journal
![Foundry Version](https://img.shields.io/badge/Foundry-v13-green)
![License](https://img.shields.io/badge/license-GPL%203.0-blue)
[![Install Module](https://img.shields.io/badge/Foundry-Install%20Module-orange)](manifest-url)


A Foundry v13 module to display fade in/out tooltips on tiles using content pulled directly from Journal Entries or Journal Pages.

This can be used for environmental descriptions, map lore, reminders, making maps more interactive, and probably a lot more.

Tile tooltips are triggered by mouse over/hover.  Tooltip content is pulled from Journal Entries or Journal Pages and players do not need journal permissions.  Does not conflict with and works alongside Monk's Active Tile Triggers ((MATT)), system agnostic, tooltips display only when the 'Token Control' layer is active.  

Example
You can create a blank/empty tile over any area or areas of a scene to make the scene background more interactive.  For example: if the scene background image is a map, you can add blank tiles to different loacations on the background and when the mouse is hovered over those locations, the tooltip will display.  You can also couple this with Monk's Active Tile Triggers to then also be able to click and interact; such as clicking to go to another scene.
---
 Update

0.4.0
    + Added support for displaying images.  Tooltips now display images present in 'Text' type journal pages and 'Image' type journal pages
    + Fixed tooltips displaying when mouse moves over/hovers a tile with an active tooltip but was beneath another Foundry window such as a character sheet, a compendium, etc..
    + Fixed tooltip would persist if displayed when a new scene was loaded
    + Fixed caching bugs
    + added manual 'Cache Now' button
    + Fixed Foundry console error when caching on a tile that was just created but not yet saved

0.3.0
    + initial release

---
 Installation

Install in Foundry - Search 'Tile Journal Tooltips'
or
Install via Foundry module.json.  Copy the link below ((links to the most current release)) or go to the releases page for the current release and then paste that into Foundry's 'Install Module' window.

```
https://github.com/devastatorx/tile-journal-tooltips/releases/latest/download/module.json
```
---

Preview

![Tooltip Demo](/images/showcase.gif)

---

Limitations

Does not display videos.  I looked into this, but in all honesty it didn't make sense to me to implement.  It also started to become very complicated.

---

Usage

After enabling the module:

**Adding a tooltip to an existing tile**

1. Select 'Tile Controls' on the left toolbar
2. Select the tile you would like to add the tooltip to
3. Open the settings window for the tile
4. Navigate to the 'Tooltip' tab

![Tooltip Settings](/images/1.png)

![Tooltip Configuration](/images/2.png)

5. Enable the tooltip by checking 'Enable Tooltip'

![Enable Tooltip](/images/3.png)

6. Select a Journal Entry in the first dropdown box.  All journals are listed.
7. Optionally (but recommended) select a Journal Page from the selected Journal Entry.  The selected journal page will be the source for the tooltip.  This includes images for text tooltips, or just the image itself if the Journal Page type is simply an image.
8. Click the button 'Cache Now' to apply the selected Journal Entry/Page as the source for the tooltip.  The 'Cache Status' will update with a date and timestamp noting when the tooltip was last cached

**Creating a new tile to be used as a tooltip**

1. Select 'Tile Controls on the left toolbar and place/draw the tile wherever you would like
2. Configure the tile however you would like.  You can create a blank/empty tile over any area or areas of a scene to make the scene background more interactive.
3. Navigate to the 'Tooltip' tab
4. Enable the tooltip by checking 'Enable Tooltip'
5. Select a Journal Entry in the first dropdown box.  All journals are listed.
6. Optionally (but recommended) select a Journal Page from the selected Journal Entry.  The selected journal page will be the source for the tooltip.  This includes images for text tooltips, or just the image itself if the Journal Page type is simply an image.
8. Click the button 'Cache Now' to apply the selected Journal Entry/Page as the source for the tooltip.  The 'Cache Status' will update with a date and timestamp noting when the tooltip was last cached

---

Settings

Enable Tooltip - activates tooltip functionality for the tile.

Journal Entry (Source) - select the Journal Entry used as the tooltip source.  Players **do not need permissions** to this journal.

Journal Page - if the journal contains multiple pages you may select a specific page.  If no page is selected the first page of the selected Journal Entry is used.  If no pages exist the Journal Entry content is used.

Cache Status - when the tile is saved the journal content is cached to the tile and a timestamp shows when the cache was last created.  By caching the journal to the tile, players do not need permissions to the journals used to create any tooltips.  If the journal entry changes, such as updating information in the selected page/entry **you must re-cache the tooltip** for the tooltip to reflect the changes made in the journal.

Cache Now - after selecting the journal/s to use for the tooltip source, click 'Cache Now' to update the information for the tooltip.  Only necessary when intially setting the tooltip or after updating a journal entry/page used as a source for that tooltip.

---

Known Issues

~~Sometimes, when creating a tile tooltip for the first time caching may fail (no date and timestamp displayed for 'Cache Status')~~
 **FIXED as of 0.4.0 by implementing a manual cache button**

~~Tooltips will likely appear if the mouse cursor hovers a tile even when that tile is behind another window, such as a character sheet, item sheet, any other open window. Should be fixed in the next release.~~  **FIXED as of 0.4.0**

~~If a tooltip is visible while switching scenes it may remain visible on the newly loaded scene.  In this case, moving the mouse over the right sidebar should cause it to fade out.  Should be fixed in the next release~~  **FIXED as of 0.4.0**

None that I am currently aware of.

---

This project is licensed under GPL 3.0