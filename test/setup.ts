import { rm } from 'node:fs/promises';

global.beforeEach(async () => {
  try {
    await rm(__dirname + '/../test.sqlite', { force: true });
  } catch (error) {}
});
