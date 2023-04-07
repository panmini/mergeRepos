const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");
const minimist = require("minimist");
const argv = minimist(process.argv.slice(2));

const octokit = new Octokit();

const helpText = `
Usage: node github-merge-repos.js [OPTIONS]

Options:
  -u, --username USERNAME    GitHub username
  -d, --destination DEST      Destination folder to clone the repositories
  -f, --file FILE             Import repositories from file
  -p, --parameters            Show the available parameters
  -v, --version               Show the version of the script
  -h, --help                  Show this help message
`;

const versionText = `
github-merge-repos version 1.1.0
`;

function printParameters() {
  console.log(helpText);
}

function printVersion() {
  console.log(versionText);
}

async function getRepos(username) {
  try {
    const { data } = await octokit.repos.listForUser({
      username: username,
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function cloneRepo(repo, destination) {
  const url = repo.clone_url;
  const name = repo.name;
  const folderPath = path.join(destination, name);

  console.log(`Cloning ${url} into ${folderPath}...`);

  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const git = require("simple-git")(folderPath);
    await git.clone(url, folderPath);
  } catch (error) {
    console.error(error.message);
  }
}

async function importReposFromFile(file, destination) {
  const fileContents = fs.readFileSync(file, "utf8");
  const repoList = fileContents.split("\n").filter((line) => !!line.trim());

  for (const repo of repoList) {
    const { owner, repo: name } = repo.split("/");
    const destinationPath = path.join(destination, name);

    console.log(`Cloning ${repo} into ${destinationPath}...`);

    try {
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      const { data: repoData } = await octokit.repos.get({
        owner,
        repo: name,
      });

      const cloneUrl = repoData.clone_url;
      const git = require("simple-git")(destinationPath);
      await git.clone(cloneUrl, destinationPath);
    } catch (error) {
      console.error(error.message);
    }
  }
}

async function main() {
  const { username, destination, file, parameters, version, help } = argv;

  if (help) {
    printParameters();
    process.exit(0);
  }

  if (version) {
    printVersion();
    process.exit(0);
  }

  if (!username || !destination) {
    console.error("Please provide a GitHub username and destination folder.");
    process.exit(1);
  }

  let repos;

  if (file) {
    if (!fs.existsSync(file)) {
      console.error(`File '${file}' does not exist.`);
      process.exit(1);
    }
    await importReposFromFile(file, destination);
  } else {
    repos = await getRepos(username);
    for (const repo of repos
