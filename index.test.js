const fs = require('fs');
const core = require('@actions/core');
const path = require('path');
const run = require('./index');
const mockFs = require('mock-fs');

jest.mock('@actions/core');

describe('Create Terraform Backend File', () => {
  beforeEach(() => {
    mockFs({
      '/github/workspace': {
        'existing_directory': {}
      }
    });

    process.env.GITHUB_WORKSPACE = '/github/workspace';

    core.getInput.mockReturnValueOnce('my-bucket');
    core.getInput.mockReturnValueOnce('existing_directory');
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('creates a .tf file', async () => {
    await run();
    const filePath = path.join(process.env.GITHUB_WORKSPACE, 'existing_directory', 'backend.tf');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('writes correct content to .tf file', async () => {
    await run();
    const filePath = path.join(process.env.GITHUB_WORKSPACE, 'existing_directory', 'backend.tf');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    expect(fileContent).toEqual(`terraform {
  backend "gcs" {
    bucket = "my-bucket"
  }
}`);
  });
});
