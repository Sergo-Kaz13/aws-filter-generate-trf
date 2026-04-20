# 🔍 Stock Filter Userscript

Tampermonkey userscript that automates product filtering across two separate internal systems.

## How it works

1. **Site A** — collects a list of products from the order/transfer table
2. **Site B** — checks each product against warehouse location availability
3. **Result** — returns a filtered list containing only products present at the specified warehouse locations

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) extension for your browser
2. Open the [`script.user.js`](./script.user.js) file on GitHub
3. Click **Raw** — Tampermonkey will prompt you to install the script automatically
4. Click **Install**

## Usage

1. Go to **Site A** — the script adds a **Filter** button to the page
2. The script collects the product list from the table
3. Go to **Site B** — the script checks warehouse locations for each product
4. The filtered product list is returned with only available items

## Requirements

- [Tampermonkey](https://www.tampermonkey.net/) v4.18+
- Access to both internal sites

## Update

The script updates automatically via GitHub when a new version is released.  
To update manually: Tampermonkey Dashboard → check for updates.
