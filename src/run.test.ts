import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { run } from './run';

describe(run, () => {
  let mockConsoleLog: MockInstance;

  beforeAll(() => {
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  beforeEach(async () => {
    await fs.rm('example/style01.css.d.ts', { force: true });
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('generates type definition files', async () => {
    await run('example', { watch: false });
    await expect(fs.access(path.normalize('example/style01.css.d.ts'))).resolves.toBeUndefined();
  });
});
