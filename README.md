# Dot UI - Polkadot Components

A monorepo containing a CLI tool and registry server for Polkadot UI components,
similar to shadcn/ui but specifically designed for Polkadot ecosystem
development. For a list of available components visit
[dot-ui.com](https://dot-ui.com)

## Architecture

This project consists of two main packages:

- **CLI** (`packages/cli`) - The `dot-ui` command-line tool for installing
  components
- **Registry** (`packages/registry`) - Next.js server that hosts the component
  registry and documentation

## Quick Start

### Using the CLI (End Users)

Install Polkadot components in your project:

```bash
# List available components
npx dot-ui list

# Add a component to your project
npx dot-ui add block-number

# You can also use pnpm or bun
pnpm dlx dot-ui add block-number
bunx dot-ui add block-number
```

## Development

### Local Setup

1. **Clone and install dependencies:**

   ```bash
   git clone https://github.com/Polkadot-UI-Initiative/dot-ui
   cd dot-ui
   pnpm install
   ```

2. **Start the registry server:**

   ```bash
   pnpm dev
   # Registry server runs at http://localhost:3000
   ```

3. **Test CLI with local registry:**
   ```bash
   cd <some_random_project>
   npm run dev -- list --dev
   npm run dev -- add block-number --dev
   ```

### Project Structure

```
dot-ui/
├── packages/
│   ├── cli/                    # CLI package (@dot-ui/cli)
│   │   ├── bin/dot-ui.js      # CLI executable
│   │   └── package.json       # Published to npm as "dot-ui"
│   └── registry/              # Registry server (@dot-ui/registry)
│       ├── app/               # Next.js app directory
│       ├── registry/          # Component definitions
│       ├── public/            # Static assets (serves registry.json)
│       └── package.json       # Registry server package
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # Workspace definition
└── README.md
```

### Available Scripts

**Root level:**

```bash
pnpm dev              # Start registry server
pnpm build            # Build all packages
pnpm build:cli        # Build CLI only
pnpm build:registry   # Build registry only
```

**CLI development:**

```bash
cd packages/cli
npm run dev -- --help          # Show CLI help
npm run dev -- list            # List from production registry
npm run dev -- list --dev      # List from localhost:3000
npm run dev -- add block-number --dev  # Install from local registry
```

**Registry development:**

```bash
cd packages/registry
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm registry:build   # Build component registry
pnpm registry:copy    # Copy registry.json to public/
```

## How It Works

### CLI → Registry Communication

1. **Production**: CLI fetches from `https://dot-ui.app`
2. **Development**: With `--dev` flag, CLI uses `http://localhost:3000`

### Component Installation Process

1. CLI fetches available components from `/registry.json`
2. User selects a component to install
3. CLI downloads component files from `/r/{component-name}.json`
4. Files are written to user's project with proper imports

### Registry Structure

Components are defined in `/registry/polkadot-ui/` with:

- **Components**: React components (`.tsx` files)
- **Hooks**: Custom hooks for Polkadot integration
- **Types**: TypeScript type definitions
- **Providers**: Context providers for chain connections

## Component Development

### Adding New Components

1. **Create component structure:**

   ```
   registry/polkadot-ui/blocks/my-component/
   ├── components/
   │   └── my-component.tsx
   ├── hooks/
   │   └── use-my-component.ts
   └── types/
       └── my-component.types.ts
   ```

2. **Register in registry.json:**

   ```json
   {
     "name": "my-component",
     "type": "registry:component",
     "title": "My Component",
     "description": "Component description",
     "files": [...]
   }
   ```

   See the shadcn [`registry-item-schema`] for more details on how to structure
   files and other options.
   (https://ui.shadcn.com/docs/registry/registry-item-json)

3. **Build and test:**
   ```bash
   cd packages/registry
   pnpm registry:build
   pnpm registry:copy
   ```

### Component Guidelines

- Use `polkadot-api` (papi) or dedot for chain interactions
- Follow React Server Component patterns where possible
- Include TypeScript types for all props and returns
- Provide comprehensive JSDoc documentation
- Test with multiple Polkadot chains (Polkadot, Kusama, Asset Hub, etc.)

## Publishing

### CLI Package

The CLI is published to npm as `dot-ui`:

```bash
cd packages/cli
npm version patch
npm publish
```

### Registry Deployment

The registry server is deployed to Vercel and serves:

- Component documentation at the root
- Registry API at `/registry.json`
- Component files at `/r/{component}.json`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-component`
3. Make your changes and test locally
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
