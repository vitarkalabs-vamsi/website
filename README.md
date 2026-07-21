# Vitarka Files Setup

This workspace contains:

- `generate_blueprint.js` — Node script that generates a `.docx` blueprint document using `docx`.
- `VitarkaLabsWebsite.jsx` — React component for a Vitarka Labs website UI section.

## Setup

1. Open a terminal in `C:\Users\vamsi\Downloads\files (6)`.
2. Run:

   ```bash
   npm install
   ```

## Generate the blueprint document

Run:

```bash
npm run generate
```

This will create:

- `ARC_Node_v2_Technical_Blueprint.generated.docx`

## Validate the JSX component

Run:

```bash
npm run validate:jsx
```

This validates the syntax of `VitarkaLabsWebsite.jsx` with Babel.

## Run the website locally

1. Install dependencies:

```bash
npm install
```

2. Start the local development server:

```bash
npm run dev
```

3. Open the URL shown in the terminal, usually:

```bash
http://localhost:4173
```

The app renders `VitarkaLabsWebsite.jsx` in a minimal Vite React environment.

## Build the website

To build a static production version:

```bash
npm run build
```

You can preview the production build with:

```bash
npm run preview
```

## Notes

- The project is a Node-based setup, not a Python virtual environment, because both source files are JavaScript/JSX.
- `VitarkaLabsWebsite.jsx` is intended to be used inside a React application.
- If you want to integrate it into a React project, copy the file into that app and render the component there.
