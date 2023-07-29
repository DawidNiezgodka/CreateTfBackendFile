const fs = require('fs');
const core = require('@actions/core');
const path = require('path');

async function run() {
  try {
    const bucketName = core.getInput('bucketName');
    const filePath = core.getInput('filePath');
    const backendConfig = `terraform {
  backend "gcs" {
    bucket = "${bucketName}"
  }
}`;
    const fullFilePath = path.join(process.env.GITHUB_WORKSPACE, filePath, 'backend.tf');
    fs.writeFileSync(fullFilePath, backendConfig);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();

module.exports = run;


