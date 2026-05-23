# Envfy

A lightweight and type-safe Node.js library for managing `.env` configuration files. Envfy makes it easy to read, write, and manage environment variables in your projects.

## Features

- ✅ **Simple API** - Intuitive methods for managing environment variables
- ✅ **Type-safe** - Built with TypeScript for full type support
- ✅ **No Dependencies** - Uses only Node.js built-in modules
- ✅ **Parse & Write** - Automatically parse and serialize `.env` files
- ✅ **Comment Support** - Skip comments and empty lines automatically
- ✅ **Quote Handling** - Properly handle quoted values with spaces
- ✅ **Escape Sequences** - Support for escape sequences like `\n` and `\t`
- ✅ **Well Tested** - Comprehensive test suite with Jest

## Installation

```bash
npm install envfy
```

or with yarn:

```bash
yarn add envfy
```

## Usage

### Basic Example

```typescript
import Envfy from 'envfy';

// Create an instance
const env = new Envfy();

// Get a value
const apiKey = env.get('API_KEY');

// Get a value with default
const port = env.get('PORT', '3000');

// Set a value
env.set('DATABASE_URL', 'postgresql://localhost/mydb');

// Check if a key exists
if (env.has('API_KEY')) {
  console.log('API_KEY is configured');
}

// Save to .env file
env.save();
```

### Custom File Path

```typescript
import Envfy from 'envfy';

const env = new Envfy({
  path: '/custom/path/.env'
});
```

### Working with Environment Variables

```typescript
import Envfy from 'envfy';

const env = new Envfy();

// Load all variables
const all = env.getAll();
console.log(all);

// Load into process.env
env.toProcessEnv();
console.log(process.env.API_KEY);

// Remove a variable
env.remove('OLD_VAR');

// Clear all variables
env.clear();
```

## API Reference

### Constructor

```typescript
new Envfy(options?: EnvOptions)
```

**Options:**
- `path` (string): Path to the `.env` file (default: `./.env`)
- `encoding` (BufferEncoding): File encoding (default: `utf-8`)

### Methods

#### `load(): void`
Reload environment variables from the `.env` file.

```typescript
env.load();
```

#### `get(key: string, defaultValue?: string): string | undefined`
Get a value by key. Returns `defaultValue` if not found.

```typescript
const value = env.get('API_KEY', 'default_value');
```

#### `set(key: string, value: string): void`
Set or update a value.

```typescript
env.set('API_KEY', 'my-secret-key');
```

#### `remove(key: string): boolean`
Remove a key-value pair. Returns `true` if removed, `false` if key didn't exist.

```typescript
const wasRemoved = env.remove('OLD_KEY');
```

#### `has(key: string): boolean`
Check if a key exists.

```typescript
if (env.has('DATABASE_URL')) {
  console.log('Database is configured');
}
```

#### `getAll(): EnvConfig`
Get all environment variables as an object.

```typescript
const allVars = env.getAll();
```

#### `clear(): void`
Clear all environment variables from memory.

```typescript
env.clear();
```

#### `save(): void`
Save the current configuration to the `.env` file.

```typescript
env.set('NEW_VAR', 'value');
env.save();
```

#### `toProcessEnv(): void`
Load all variables into `process.env`.

```typescript
env.toProcessEnv();
```

#### `getFilePath(): string`
Get the path to the `.env` file being used.

```typescript
const filePath = env.getFilePath();
```

## .env File Format

Envfy supports standard `.env` file format:

```env
# Comments start with #
API_KEY=my-secret-key

# Values with spaces should be quoted
DATABASE_URL="postgresql://localhost:5432/mydb"

# Single quotes are also supported
SECRET='my-secret-value'

# Escape sequences are supported
MULTILINE="line1\nline2"
TAB_VALUE="col1\tcol2"
```

## Example Project Structure

```
project/
├── .env
├── .env.example
├── src/
│   └── index.ts
├── package.json
└── tsconfig.json
```

### .env.example
```env
API_KEY=
DATABASE_URL=
PORT=3000
```

## Error Handling

```typescript
import Envfy from 'envfy';

try {
  const env = new Envfy({ path: '/invalid/path/.env' });
  env.save(); // This might throw if the path is invalid
} catch (error) {
  console.error('Error managing .env file:', error.message);
}
```

## Development

### Prerequisites
- Node.js 14+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/le4nnt0nn/envfy.git
cd envfy

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Watch mode for development
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT - see LICENSE file for details

## Author

**le4nnt0nn**