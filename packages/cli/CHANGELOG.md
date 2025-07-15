# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-alpha.1] - 2025-01-31

### Added

- Initial alpha release of dot-ui CLI
- **`init` command** - Initialize new projects with Polkadot UI components
  - Interactive project setup with framework selection (Next.js/Vite)
  - Automatic TypeScript, ESLint, and Tailwind CSS configuration
  - Automatic shadcn/ui initialization
  - Support for both App Router and Pages Router (Next.js)
  - Configurable import aliases and project structure
- **`add` command** - Add Polkadot UI components to projects
  - Automatic project detection and validation
  - Auto-create new project if none exists
  - Automatic shadcn/ui initialization if needed
  - Component installation with automatic dependency resolution
  - Polkadot API setup with chain metadata generation
  - Support for registry dependencies
- **`list` command** - List available components from registry
  - Component details including descriptions and requirements
  - Support for both production and development registries
- **`help` command** - Show help information for all commands
- **Global options support**:
  - `--dev` - Use development registry (localhost:3000)
  - `--verbose` - Show detailed output
  - `--force` - Force installation even if files exist
  - `--yes` - Skip all prompts and use default values
- **Package manager detection** - Automatic detection of npm, pnpm, yarn, and
  bun
- **Framework support**:
  - Next.js 14+ with App Router
  - Vite + React with TypeScript
  - Automatic Tailwind CSS v4 configuration
- **Polkadot API integration**:
  - Automatic polkadot-api installation
  - Chain metadata setup with papi CLI
  - TypeScript type generation
  - Provider and configuration setup
- **Project structure detection**:
  - Automatic detection of existing React projects
  - Support for both src/ and root-level components
  - Flexible component and hook directory structure

### Features

- **Non-interactive mode** - Complete automation with `--yes` flag
- **Development workflow** - Local registry support for component development
- **Error handling** - Comprehensive error messages and recovery suggestions
- **Memory optimization** - Automatic memory limit increases for large chain
  metadata
- **Cross-platform** - Works on macOS, Linux, and Windows
- **Zero-configuration** - Sensible defaults for immediate productivity

### Technical Details

- Built with TypeScript for type safety
- Uses execa for reliable subprocess execution
- Inquirer.js for interactive prompts
- Ora for elegant loading spinners
- Chalk for colored terminal output
- Commander.js for CLI argument parsing
- Supports Node.js 16+
- ESM-first architecture

### Registry Integration

- Fetches components from dot-ui.app registry
- Support for custom registry URLs
- Automatic component validation
- Registry dependency resolution
- Component metadata and file management

### Known Limitations

- Requires Node.js 16 or higher
- Currently supports React-based projects only
- Polkadot API setup requires sufficient system memory
- Some chains may require manual metadata installation for memory-constrained
  systems
