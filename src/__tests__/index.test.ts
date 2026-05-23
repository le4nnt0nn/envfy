import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Envfy } from '../index';

describe('Envfy', () => {
  let testDir: string;
  let envFilePath: string;

  beforeEach(() => {
    // Create a temporary directory for tests
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'envfy-test-'));
    envFilePath = path.join(testDir, '.env');
  });

  afterEach(() => {
    // Clean up temporary directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe('Loading and Parsing', () => {
    it('should create a new instance with default path', () => {
      const envfy = new Envfy();
      expect(envfy).toBeDefined();
      expect(envfy.getFilePath()).toContain('.env');
    });

    it('should load a .env file', () => {
      fs.writeFileSync(envFilePath, 'KEY1=value1\nKEY2=value2\n');
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.get('KEY1')).toBe('value1');
      expect(envfy.get('KEY2')).toBe('value2');
    });

    it('should skip comments and empty lines', () => {
      fs.writeFileSync(
        envFilePath,
        '# This is a comment\nKEY1=value1\n\n# Another comment\nKEY2=value2\n'
      );
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.get('KEY1')).toBe('value1');
      expect(envfy.get('KEY2')).toBe('value2');
    });

    it('should handle quoted values', () => {
      fs.writeFileSync(
        envFilePath,
        'KEY1="value with spaces"\nKEY2=\'single quoted\'\n'
      );
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.get('KEY1')).toBe('value with spaces');
      expect(envfy.get('KEY2')).toBe('single quoted');
    });

    it('should handle escape sequences', () => {
      fs.writeFileSync(envFilePath, 'KEY1="line1\\nline2"\nKEY2="tab\\there"\n');
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.get('KEY1')).toBe('line1\nline2');
      expect(envfy.get('KEY2')).toBe('tab\there');
    });

    it('should handle non-existent file', () => {
      const nonExistentPath = path.join(testDir, 'non-existent.env');
      const envfy = new Envfy({ path: nonExistentPath });

      expect(envfy.getAll()).toEqual({});
    });
  });

  describe('Getting and Setting', () => {
    it('should get a value', () => {
      fs.writeFileSync(envFilePath, 'KEY=value\n');
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.get('KEY')).toBe('value');
    });

    it('should get a default value if key does not exist', () => {
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.get('NON_EXISTENT', 'default')).toBe('default');
    });

    it('should return undefined if key does not exist and no default', () => {
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.get('NON_EXISTENT')).toBeUndefined();
    });

    it('should set a value', () => {
      const envfy = new Envfy({ path: envFilePath });
      envfy.set('NEW_KEY', 'new_value');

      expect(envfy.get('NEW_KEY')).toBe('new_value');
    });

    it('should overwrite an existing value', () => {
      fs.writeFileSync(envFilePath, 'KEY=old_value\n');
      const envfy = new Envfy({ path: envFilePath });
      envfy.set('KEY', 'new_value');

      expect(envfy.get('KEY')).toBe('new_value');
    });
  });

  describe('Checking and Removing', () => {
    it('should check if a key exists', () => {
      fs.writeFileSync(envFilePath, 'KEY=value\n');
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.has('KEY')).toBe(true);
      expect(envfy.has('NON_EXISTENT')).toBe(false);
    });

    it('should remove a key', () => {
      fs.writeFileSync(envFilePath, 'KEY1=value1\nKEY2=value2\n');
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.remove('KEY1')).toBe(true);
      expect(envfy.has('KEY1')).toBe(false);
      expect(envfy.get('KEY2')).toBe('value2');
    });

    it('should return false when removing non-existent key', () => {
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.remove('NON_EXISTENT')).toBe(false);
    });
  });

  describe('Getting All and Clearing', () => {
    it('should get all values', () => {
      fs.writeFileSync(envFilePath, 'KEY1=value1\nKEY2=value2\n');
      const envfy = new Envfy({ path: envFilePath });

      const all = envfy.getAll();
      expect(all).toEqual({ KEY1: 'value1', KEY2: 'value2' });
    });

    it('should return a copy of the config', () => {
      fs.writeFileSync(envFilePath, 'KEY=value\n');
      const envfy = new Envfy({ path: envFilePath });

      const all = envfy.getAll();
      all['NEW_KEY'] = 'should_not_affect_original';

      expect(envfy.has('NEW_KEY')).toBe(false);
    });

    it('should clear all values', () => {
      fs.writeFileSync(envFilePath, 'KEY1=value1\nKEY2=value2\n');
      const envfy = new Envfy({ path: envFilePath });

      envfy.clear();

      expect(envfy.getAll()).toEqual({});
    });
  });

  describe('Saving', () => {
    it('should save configuration to file', () => {
      const envfy = new Envfy({ path: envFilePath });
      envfy.set('KEY1', 'value1');
      envfy.set('KEY2', 'value2');
      envfy.save();

      const content = fs.readFileSync(envFilePath, 'utf-8');
      expect(content).toContain('KEY1=value1');
      expect(content).toContain('KEY2=value2');
    });

    it('should quote values with spaces', () => {
      const envfy = new Envfy({ path: envFilePath });
      envfy.set('KEY', 'value with spaces');
      envfy.save();

      const content = fs.readFileSync(envFilePath, 'utf-8');
      expect(content).toContain('KEY="value with spaces"');
    });

    it('should escape quotes in values', () => {
      const envfy = new Envfy({ path: envFilePath });
      envfy.set('KEY', 'value with "quotes"');
      envfy.save();

      const content = fs.readFileSync(envFilePath, 'utf-8');
      expect(content).toContain('KEY="value with \\"quotes\\""');
    });

    it('should persist saved values', () => {
      const envfy = new Envfy({ path: envFilePath });
      envfy.set('KEY1', 'value1');
      envfy.set('KEY2', 'value2');
      envfy.save();

      const envfy2 = new Envfy({ path: envFilePath });
      expect(envfy2.get('KEY1')).toBe('value1');
      expect(envfy2.get('KEY2')).toBe('value2');
    });
  });

  describe('Process Environment', () => {
    it('should load values to process.env', () => {
      fs.writeFileSync(envFilePath, 'TEST_KEY_ENVFY=test_value\n');
      const envfy = new Envfy({ path: envFilePath });

      // Remove the key if it exists
      delete process.env['TEST_KEY_ENVFY'];

      envfy.toProcessEnv();

      expect(process.env['TEST_KEY_ENVFY']).toBe('test_value');

      // Clean up
      delete process.env['TEST_KEY_ENVFY'];
    });
  });

  describe('File Path', () => {
    it('should return the correct file path', () => {
      const envfy = new Envfy({ path: envFilePath });

      expect(envfy.getFilePath()).toBe(envFilePath);
    });
  });

  describe('Custom Encoding', () => {
    it('should use custom encoding', () => {
      fs.writeFileSync(envFilePath, 'KEY=value\n', 'utf-8');
      const envfy = new Envfy({ path: envFilePath, encoding: 'utf-8' });

      expect(envfy.get('KEY')).toBe('value');
    });
  });
});
