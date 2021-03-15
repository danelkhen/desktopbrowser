# DesktopBrowser

Web based file explorer, runs locally on your browser, designed for media desktops.

### Installation

Install [Node.js](https://nodejs.org)

```
git clone https://github.com/danelkhen/desktopbrowser.git
cd desktopbrowser
cd client
npm install
npm run build
cd ..
cd server
npm install
npx tsc
cd ..
```

### Run

```
node server
```

browse to http://localhost:7777/

### Features

Quick find
Sorting by any column(s)
Folder size calculation
Next / previous sibling folder navigation
Browser navigation and bookmarks
Columns: Name, Last Modified, Size, Extension
File/Folder operations: Delete

### Roadmap

UI and graphics
File/Folder operations (cut, copy, paste)
Custom operations - play all, unzip
