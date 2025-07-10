# Polkadot UI CLI

A CLI tool for installing Polkadot UI components with automatic API setup.
Supports Next.js, Vite, and Create React App projects.

## Installation

### For Development (Local Testing)

```bash
# Clone the repository and navigate to CLI directory
git clone <repo-url>
cd registry-template-v4/cli

# Link the package locally for testing
npm link
```

### For Production

```bash
# Install globally (when published to npm)
npm install -g polkadot-ui
```

## Usage

### List Available Components

```bash
# Production registry
polkadot-ui list

# Development registry (localhost:3000)
polkadot-ui list --dev
```

### Install Components

```bash
# Production - uses mainnet Polkadot
polkadot-ui add block-number

# Development - uses testnet Paseo Asset Hub
polkadot-ui add block-number --dev
```

## Testing the CLI

### Prerequisites

1. **Start the registry dev server**:

   ```bash
   cd registry-template-v4
   pnpm dev
   # Should run on http://localhost:3000
   ```

2. **Link the CLI globally** (one-time setup):
   ```bash
   cd registry-template-v4/cli
   npm link
   # This makes 'polkadot-ui' command available globally
   ```

### Create Test Project

```bash
# Create a fresh Next.js project
cd /tmp
npx create-next-app@latest test-polkadot-cli --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-pnpm --turbopack

# Navigate to project
cd test-polkadot-cli

# Fix pnpm store if needed
pnpm install

# Add a componet from the library
polkadot-ui add block-number
```

## What the CLI Does

1. **Validates project structure** - Ensures React/TypeScript setup
2. **Detects Tailwind version** - Uses `shadcn@canary` for v4, `shadcn@latest`
   for v3
3. **Shows interactive prompts** - Users can select shadcn preferences (colors,
   etc.)
4. **Installs component** - Uses shadcn CLI with user input
5. **Detects Polkadot components** - Checks for `polkadot-api` dependency or
   `requiresPolkadotApi` flag
6. **Sets up Polkadot API** - Only for components that need it:
   - Adds chain metadata (`papi add paseo_asset_hub` or `papi add polkadot`)
   - Generates TypeScript types (`papi`)
   - Adapts provider to prefer the configured chain
7. **Shows detailed next steps** - Complete integration instructions with code
   examples

## Troubleshooting

### Registry Server Not Found

```bash
# Make sure the registry dev server is running on port 3000
cd registry-template-v4
pnpm dev
# Check: curl http://localhost:3000/registry.json
```

### pnpm Store Version Error

```bash
# Fix with:
pnpm install
# This recreates node_modules with correct store version
```

### Tailwind CSS Not Found

```bash
# For Next.js projects created with --tailwind, this should be automatic
# For manual setup:
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### TypeScript Errors with Polkadot API

The CLI generates TypeScript definitions automatically. If you see type errors:

1. **Check `.papi` directory exists** with generated files
2. **Restart TypeScript server** in your editor
3. **Verify `@polkadot-api/descriptors` is installed** in node_modules
4. **Ensure the provider is properly imported** in your app

### Component Not Working

1. **Wrap your app with PolkadotProvider** as shown in next steps
2. **Check browser console** for connection errors
3. **Verify network connection** to Paseo Asset Hub (dev) or Polkadot (prod)

## File Structure After Installation

```
your-project/
├── .papi/
│   ├── polkadot-api.json
│   └── descriptors.d.ts
├── components/
│   ├── block-number.tsx
│   └── ui/
│       └── button.tsx
├── hooks/
│   └── use-block-number.ts
├── providers/
│   └── polkadot-provider.tsx
├── node_modules/
│   ├── polkadot-api/
│   ├── @polkadot-api/descriptors/
│   └── ...
└── package.json (updated with polkadot-api dependency)
```

## Contributing

To add new components to the registry:

1. **Add component files** to `registry/new-york/blocks/your-component/`
2. **Update `registry.json`** to include the new component
3. **Set `requiresPolkadotApi: true`** if it needs blockchain connection with
   papi
4. **Test with CLI**: `polkadot-ui add your-component --dev`
