# Claude Code Review Guidelines

This document provides guidelines for Claude when performing code reviews on
this repository.

## Project Overview

This is a Polkadot UI component registry and CLI tool project built with:

- Next.js 14 App Router
- TypeScript
- React components for Polkadot ecosystem
- polkadot-api (papi) and dedot for chain interactions
- Shadcn UI and Tailwind CSS for styling

## Code Review Focus Areas

### 1. TypeScript and React Best Practices

- Ensure proper TypeScript types are used
- Prefer functional components over class components
- Use proper hooks patterns and avoid unnecessary re-renders
- Check for proper error handling and edge cases

### 2. Polkadot Integration

- Verify proper usage of polkadot-api (papi) or dedot
- Check chain connection handling
- Ensure wallet integration follows best practices
- Validate transaction handling and error states

### 3. Component Architecture

- Follow the established registry structure in `/registry/polkadot-ui/`
- Ensure components are properly exported and documented
- Check for proper prop types and JSDoc documentation
- Verify responsive design with Tailwind CSS

### 4. Performance Considerations

- Look for unnecessary re-renders
- Check for proper memoization where needed
- Ensure lazy loading for heavy components
- Validate bundle size implications

### 5. Security and Best Practices

- Check for proper input validation
- Ensure secure handling of private keys and sensitive data
- Validate proper error boundaries
- Check for XSS vulnerabilities in dynamic content

## Project-Specific Guidelines

### File Structure

- Components go in `/registry/polkadot-ui/blocks/[component-name]/`
- Use kebab-case for directory names
- Include proper `registry.json` entries for new components

### Coding Standards

- Use `function` keyword for pure functions
- Prefer named exports
- Use descriptive variable names with auxiliary verbs
- Follow the RORO pattern (Receive an Object, Return an Object)
- Place error handling at the beginning of functions
- Use early returns for error conditions

### Dependencies

- Prefer existing project dependencies over adding new ones
- Use polkadot-api (papi) or dedot for chain interactions
- Use Shadcn UI components when possible
- Follow Next.js App Router patterns

## Review Tone

- Be constructive and helpful
- Provide specific examples when suggesting improvements
- Acknowledge good practices when you see them
- Focus on maintainability and readability
