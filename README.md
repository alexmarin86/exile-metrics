# Exile Metrics

A free and open source farming session tracking application built specifically for Path of Exile players. Optimize your mapping strategies without the complexity.

## About

Exile Metrics helps you measure the profitability of different mapping strategies by tracking your time investment, costs, and returns in an intuitive and streamlined way. Whether you're running scarab strategies, testing different map crafts, or comparing the efficiency of various farming methods, Exile Metrics provides the data you need to make informed decisions.

### Key Features

- **Session Tracking**: Create detailed farming sessions with map information, scarab usage, chisel costs, and map device crafts
- **Time Management**: Built-in stint timer system to accurately measure time spent mapping
- **Cost Analysis**: Comprehensive cost breakdown with automatic profit calculations
- **Strategy Comparison**: Visual charts comparing different farming strategies side by side

### Philosophy

Exile Metrics is designed for Path of Exile players who hate overcomplicating things. We believe that tracking your farming efficiency shouldn't require complex spreadsheets, custom setups, or hours of configuration. Enter your session details in seconds and focus on mapping, not fiddling with tools.

## Free and Open Source

Exile Metrics is completely free to use and will always remain so. Our source code is released under the **GNU General Public License v3 (GPLv3)**, ensuring that this project remains free and open for the entire Path of Exile community.

## Tech Stack

This application is built with:

- **Vue 3** with TypeScript
- **Vite** for fast development and building
- **Convex** for real-time backend and database
- **Tailwind CSS** for styling
- **Clerk** for authentication

## Development Setup

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

### Configuration

See [Vite Configuration Reference](https://vite.dev/config/) for customization options.

## Project Setup

Install dependencies:

```sh
pnpm install
```

### Development Commands

Start the development server with hot-reload:

```sh
pnpm dev
```

### Environmental variables

To run the application while in development, you need to create a `.env` file in the root directory and add the following variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CONVEX_URL=https://your_convex_url
VITE_GITHUB_URL=https://github.com/your_github_repo
```

For production, you will need to obtain a CONVEX_DEPLOY_KEY from your Convex dashboard and set it in your deployment environment.

### Building for Production

Type-check, compile and minify for production:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

### Deployment

When you're ready to deploy your application, make sure to set the appropriate environment variables in your hosting provider's dashboard. Also, make sure to update your build command to include the Convex deployment.

Vercel Example:

```sh
pnpm dlx convex deploy --cmd 'pnpm run build'
```

For other hosting providers, refer to their documentation for setting environment variables and deploying Node.js applications.

### Code Quality

Lint with [ESLint](https://eslint.org/):

```sh
pnpm lint
```

Format code with Prettier:

```sh
pnpm format
```

Type-check the project:

```sh
pnpm type-check
```

## Contributing

We welcome contributions from the Path of Exile community! Whether you're reporting bugs, suggesting features, or submitting code improvements, your help is appreciated.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Disclaimer

Exile Metrics is a community project and is not affiliated with, endorsed by, or connected to Grinding Gear Games or Path of Exile in any official capacity. Path of Exile is a trademark of Grinding Gear Games Ltd.
