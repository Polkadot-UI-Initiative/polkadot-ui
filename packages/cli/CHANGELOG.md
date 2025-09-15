# Changelog

All notable changes to this project will be documented in this file!

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2025-07-21

### Added

- **Address Input Component** - New comprehensive address input component with
  validation
  - Support for both SS58 (Polkadot) and Ethereum address formats
  - Real-time address validation with visual feedback
  - Identity lookup integration with Polkadot identity registry
  - Search functionality by display name
  - Customizable identicon support
  - Truncated address display options
  - Copy-to-clipboard functionality
  - TypeScript support with comprehensive prop types
- **Testing Infrastructure** - Complete Jest testing setup for component library
  - Jest configuration for TypeScript and React components
  - Testing utilities and mocks for Polkadot APIs
  - Component testing examples and best practices
  - Coverage reporting and CI integration
- **Analytics and Telemetry** - PostHog integration for usage tracking
  - Command usage tracking
  - Component addition success/failure metrics
  - Library detection and selection analytics
  - System information collection for debugging
  - Privacy-focused telemetry with opt-out capabilities
- **New Chain Support** - Added Paseo People chain configuration
  - Metadata and descriptor generation for paseo_people chain
  - Updated default chain configuration
  - Improved chain initialization and management

### Changed

- **CLI Options** - Replaced `--yes` flag with `--interactive` for better UX
  - Interactive mode now shows detailed prompts and configuration options
  - Fast mode (non-interactive) is now the default behavior
  - Improved command flow and user experience
- **Component Library** - Enhanced UI components and utilities
  - Updated Badge, Input, and Label components with better styling
  - Improved utility functions for address validation and formatting
  - Enhanced provider components with chain initialization
  - Better TypeScript types and interfaces
- **Dependencies** - Updated core dependencies for better stability
  - Next.js updated to 15.4.2 with improved performance
  - Updated Polkadot API libraries and utilities
  - Enhanced testing libraries and Jest ecosystem packages

### Fixed

- **TypeScript Compilation** - Resolved type conflicts in Jest setup
  - Fixed TextDecoder type compatibility issues
  - Improved global type declarations for testing environment
  - Better type safety for CSS and Web API mocks
- **Build Process** - Improved reliability of registry building
  - Better error handling for metadata generation
  - Memory optimization for large chain metadata processing
  - More robust postinstall script execution
- **Component Resolution** - Enhanced component detection and installation
  - Better handling of missing projects with auto-creation
  - Improved library detection for Polkadot APIs
  - Enhanced error messages and recovery suggestions

### Improved

- **Accessibility** - Enhanced address input component with WCAG 2.1 AA
  compliance
  - Added `aria-expanded` attribute to input element indicating dropdown state
  - Added `aria-haspopup="listbox"` to announce dropdown functionality
  - Added `aria-controls` linking input to dropdown for screen readers
  - Added `role="listbox"` to search results dropdown container
  - Added `aria-label="Address search results"` for accessible dropdown naming
  - Added `role="option"` to each search result button
  - Added `aria-selected="false"` to indicate option selection state
  - Improved keyboard navigation and screen reader experience
  - Enhanced focus management for assistive technologies

### Technical Improvements

- **Code Quality** - Enhanced development workflow and standards
  - Comprehensive testing setup with coverage reporting
  - Better error handling and logging throughout CLI
  - Improved type safety and TypeScript coverage
- **Performance** - Optimized build and installation processes
  - Faster component installation with parallel processing
  - Memory-efficient metadata handling
  - Improved registry caching and validation
- **Documentation** - Enhanced component documentation and examples
  - Comprehensive README files for new components
  - Testing guides and best practices
  - Updated installation and usage examples

## [0.2.0-alpha.1] - 2025-07-18

### Changed

- Updated documentation to use "polkadot-ui" branding consistently
- Updated all CLI command examples to use `polkadot-ui` instead of `dot-ui`
- Updated registry URLs to use polkadot-ui.com (production domain)
- Maintained internal references to polkadot-ui for consistency

### Fixed

- Fixed package manager detection for workspace configurations
- Improved error handling for registry connection issues
- Updated component installation examples in documentation

## [0.1.0-alpha.1] - 2025-01-31

### Added

- Initial alpha release of polkadot-ui CLI
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

- Fetches components from polkadot-ui.com registry
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
