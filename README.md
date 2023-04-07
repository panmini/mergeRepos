# Repo Merger
This is a Node.js script that merges multiple public GitHub repositories into one. The merged repository will contain all the files and commit history of the original repositories.

## Installation
Clone the repository.
Install dependencies by running npm install.
## Usage
To run the script, use the following command:

```
node merge-repos.js <username> <destination> [-f <file> | -r <repo1> <repo2> ...] [-v]
```
## Parameters
- `<username>` (required): the GitHub username of the owner of the repositories to be merged.
- `<destination>` (required): the local path of the directory where the merged repository will be created.
- `-f <file> `(optional): a file containing the list of repositories to be merged. Each line should contain the name of a repository to be merged. The repository names should be separated by spaces or tabs.
- `-r <repo1> <repo2> ...` (optional): a list of repositories to be merged. The repository names should be separated by spaces.
- `-v`(optional): prints the version number of the script.

## Examples
Merge repositories listed in a file:
```
node merge-repos.js myusername /path/to/merged-repo -f repo-list.txt
```

Merge repositories specified on the command line:
```
node merge-repos.js myusername /path/to/merged-repo -r repo1 repo2 repo3
```

Print the version number:
```
node merge-repos.js -v
```

## License
This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) - see the LICENSE file for details.

# Acknowledgements
This project uses the [Octokit REST API client library](https://github.com/octokit/rest.js/) to access the GitHub API.
