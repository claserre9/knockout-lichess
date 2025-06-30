# TypeScript Web Application Starter
A TypeScript-powered web application starter with modern tools and frameworks. This project uses Webpack for bundling, Sass for styling, and Knockout.js for a reactive UI framework. Features include optimized builds, PostCSS with Autoprefixer, ESLint integration for linting, and a development server for streamlined workflows.
### Key Features:
- **TypeScript 5.5.3**: Strongly typed JavaScript for scalability.
- **Webpack**: Modular builds with optimizations.
- **Sass**: Advanced styling support.
- **Knockout.js**: MVVM framework for dynamic UIs.
- **Development Server**: Live reloading and quick prototyping.
- **CSS Post-Processing**: Autoprefixer and CSS minimizer.
- **Code Quality**: ESLint and TypeScript linting.

### Scripts:
- **Start Development Server**: `npm run serve:dev`
- **Build for Development**: `npm run build:dev`
- **Start Production Server**: `npm run serve:prod`
- **Build for Production**: `npm run build`

[//]: # (- **Deploy to GitHub Pages**: `npm run deploy`)

### Getting Started:
1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start your development server with `npm run serve:dev`.

### Lichess OAuth Setup

The AI challenge feature requires an OAuth token from Lichess. Create an OAuth
application on Lichess and copy the **client ID** and **redirect URI** into
`LichessGameViewModel.ts`. When visiting the Lichess page for the first time you
will be redirected to Lichess to authorise the application. After authorisation,
the token is stored in `localStorage` and used for subsequent AI challenges.
