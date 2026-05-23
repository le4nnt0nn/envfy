# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-23

### Added
- Initial release of Envfy
- Core `Envfy` class for managing `.env` files
- `load()` method to read `.env` files
- `get()` method to retrieve configuration values with default support
- `set()` method to set configuration values
- `remove()` method to delete configuration values
- `has()` method to check key existence
- `getAll()` method to retrieve all configuration values
- `clear()` method to clear all configuration
- `save()` method to persist configuration to file
- `toProcessEnv()` method to load variables into `process.env`
- `getFilePath()` method to get the current `.env` file path
- Support for quoted values with spaces
- Support for single and double quotes
- Support for escape sequences (`\n`, `\t`)
- Support for comments (lines starting with `#`)
- Automatic handling of empty lines
- Full TypeScript support with type definitions
- Comprehensive test suite with 24+ test cases
- Full JSDoc documentation for all methods
- ESLint configuration for code quality
- Jest configuration for testing

### Features
- **Type-safe**: Full TypeScript support
- **Zero dependencies**: Uses only Node.js built-in modules
- **Well-tested**: Comprehensive test coverage
- **Production-ready**: Following best practices
- **Flexible**: Support for custom file paths and encodings

### Documentation
- Complete README with API reference
- Usage examples
- Installation instructions
- Contributing guidelines
- MIT License
