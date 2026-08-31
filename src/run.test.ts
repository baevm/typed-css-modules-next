import fs from 'node:fs/promises';
import path from 'node:path';
import isThere from 'is-there';
import { run } from './run';

describe(run, () => {
  let mockConsoleLog: jest.SpyInstance;

  beforeAll(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  });

  beforeEach(async () => {
    await fs.rm('example/style01.css.d.ts', { force: true });
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('generates type definition files', async () => {
    await run('example', { watch: false });
    expect(isThere(path.normalize('example/style01.css.d.ts'))).toBeTruthy();
  });
});
