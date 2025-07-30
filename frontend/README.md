# Personal Notes Manager Frontend

A clean, minimalistic React app for managing your personal notes with folders/tags, powerful text editing, and instant search. 

## Features

- **Create/Edit/Delete Notes:** Intuitive note editor, real-time updates.
- **Organize with Folders:** Sidebar lets you switch and create new folders/tags.
- **Search:** Instantly filter notes with the search bar.
- **List & Detail View:** Left for navigation, right for editing/viewing.
- **Minimalistic Style:** Brand colors, no UI library, fully responsive.
- **Lightweight:** Optimized with minimal dependencies and fast load.

## Layout

- **Sidebar (Left):** Folders/Tags
- **Main Notes List:** Search + note items
- **Editor/Viewer Panel:** Compose and read notes

## Brand Colors

Main palette is set in `src/App.css` (customize!):

```css
:root {
  --primary: #1976D2;
  --secondary: #424242;
  --accent: #FFD600;
}
```

## Usage

- `npm start` — Local dev server at http://localhost:3000
- `npm test` — Runs UI tests
- `npm run build` — Production build

## Customize and Extend

- **Add API Integration:** Replace in-memory data in `src/App.js` with calls to your backend.
- **Change Colors/Fonts:** Update `src/App.css` variables and font definitions.
- **Expand Features:** Add markdown support, auth, or dark mode if desired.

## Accessibility

- Keyboard shortcuts:
  - <kbd>n</kbd> to create a note.
  - <kbd>e</kbd> to edit current note.

## Learn More

[React documentation](https://reactjs.org/)

