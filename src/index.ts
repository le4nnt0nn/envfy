import * as fs from 'fs';
import * as path from 'path';

export interface EnvConfig {
  [key: string]: string | undefined;
}

export interface EnvOptions {
  path?: string;
  encoding?: BufferEncoding;
}

/**
 * Envfy - Environment Variables Manager
 * A lightweight library for managing .env configuration files
 */
export class Envfy {
  private filePath: string;
  private encoding: BufferEncoding;
  private config: EnvConfig = {};

  constructor(options: EnvOptions = {}) {
    this.filePath = options.path || path.join(process.cwd(), '.env');
    this.encoding = options.encoding || 'utf-8';
    this.load();
  }

  /**
   * Load environment variables from .env file
   */
  public load(): void {
    if (!fs.existsSync(this.filePath)) {
      this.config = {};
      return;
    }

    try {
      const content = fs.readFileSync(this.filePath, this.encoding);
      this.config = this.parse(content);
    } catch (error) {
      throw new Error(`Failed to read .env file: ${(error as Error).message}`);
    }
  }

  /**
   * Parse .env file content into a configuration object
   */
  private parse(content: string): EnvConfig {
    const config: EnvConfig = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) {
        continue;
      }

      const key = trimmed.substring(0, equalsIndex).trim();
      let value = trimmed.substring(equalsIndex + 1).trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle escape sequences
      value = value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

      config[key] = value;
    }

    return config;
  }

  /**
   * Get a configuration value
   */
  public get(key: string, defaultValue?: string): string | undefined {
    return this.config[key] ?? defaultValue;
  }

  /**
   * Set a configuration value
   */
  public set(key: string, value: string): void {
    this.config[key] = value;
  }

  /**
   * Remove a configuration value
   */
  public remove(key: string): boolean {
    if (key in this.config) {
      delete this.config[key];
      return true;
    }
    return false;
  }

  /**
   * Get all configuration values
   */
  public getAll(): EnvConfig {
    return { ...this.config };
  }

  /**
   * Check if a key exists
   */
  public has(key: string): boolean {
    return key in this.config;
  }

  /**
   * Clear all configuration values
   */
  public clear(): void {
    this.config = {};
  }

  /**
   * Save configuration to .env file
   */
  public save(): void {
    try {
      const content = this.stringify();
      fs.writeFileSync(this.filePath, content, this.encoding);
    } catch (error) {
      throw new Error(`Failed to write .env file: ${(error as Error).message}`);
    }
  }

  /**
   * Convert configuration to .env file format
   */
  private stringify(): string {
    const lines: string[] = [];

    for (const [key, value] of Object.entries(this.config)) {
      if (value === undefined) {
        continue;
      }

      // Quote value if it contains spaces or special characters
      const needsQuotes = /\s|#|=/.test(value);
      const quotedValue = needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value;

      lines.push(`${key}=${quotedValue}`);
    }

    return lines.join('\n') + (lines.length > 0 ? '\n' : '');
  }

  /**
   * Load environment variables from .env file into process.env
   */
  public toProcessEnv(): void {
    for (const [key, value] of Object.entries(this.config)) {
      if (value !== undefined) {
        process.env[key] = value;
      }
    }
  }

  /**
   * Get the path to the .env file being used
   */
  public getFilePath(): string {
    return this.filePath;
  }
}

export default Envfy;
