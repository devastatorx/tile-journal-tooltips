# Tile Tooltip Journal
[![Install Module](https://img.shields.io/badge/Foundry-Install%20Module-red)](manifest-url)

![Foundry Version](https://img.shields.io/badge/foundry-v13-compatible-green)
![License](https://img.shields.io/badge/license-GPL%203.0-blue)
![Module Type](https://img.shields.io/badge/type-FoundryVTT%20Module-orange)

Display **interactive tooltips on tiles** using content pulled directly from Journal Entries or Journal Pages.

Perfect for:

* Environmental descriptions
* Map lore
* GM reminders
* Hidden worldbuilding
* Interactive map exploration

---

# Install

### Install via Foundry

Paste this **Manifest URL** into Foundry's **Install Module** window.

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

* Tile tooltips triggered by **mouse hover**
* Smooth **fade-in / fade-out animations**
* Pulls content from **Journal Entries or Journal Pages**
* **Players do not need journal permissions**
* Prevents story spoilers
* Works with **Monk's Active Tile Triggers**
* **System agnostic**
* Tooltips display **only while using Token Controls**

---

# Limitations

Currently supported:

 Journal text content

Not yet supported:

 Journal images

Image support is planned for a future update.

---

# Planned Features

* Journal **image support**
* Tooltip **themes**
* Custom **tooltip styling**
* Expanded **journal page type support**

---

# Usage

After enabling the module:

1. Select **Tile Controls**
2. Place or select a tile
3. Open **Tile Settings**
4. Navigate to the **Tooltip tab**

![Tooltip Settings](/images/1.png)

![Tooltip Configuration](/images/2.png)

---

# Enabling Tooltips

Enable the tooltip by checking:

**Enable Tooltip**

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

If none is selected:

* The **first page** is used
* If no pages exist the **Journal Entry content** is used

---

## Cache Status

When the tile is saved the journal content is **cached to the tile**.

A timestamp shows when the cache was last created.

Caching allows tooltips to display **without journal permissions**.

### Important

If the journal entry changes:

You must **re-cache the tooltip**.

---

# Known Issues

<details>
<summary>Initial tooltip caching may fail</summary>

Ensure the tile has a **name set in the Appearance tab**.

If caching fails:

1. Click **Apply** or **Update Tile**
2. Reopen the tile settings
3. Go back to **Tooltip tab**
4. Apply again

If the **Cache Status shows a timestamp**, it worked.

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

If a tooltip is visible while switching scenes it may remain visible.

Moving the mouse over the **right sidebar** will fade it out.

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