export const apps = {
  "app-1-1": "first",
  "app-1-2": "second",
  "app-2-1": "third",
  "app-2-2": "forth",
};

export const appRepoNameMapping = {
  first: "first",
  second: "second",
  third: "third",
  forth: "forth",
};

export const appRepoGitUrlMapping = {
  first: "https://github.com/movwf/dnd-matrix.git",
  second: "https://github.com/movwf/dnd-matrix.git",
  third: "https://github.com/movwf/dnd-matrix.git",
  forth: "https://github.com/movwf/dnd-matrix.git",
};

// NOTE: According to the %APP_BASE%
export const getRepoLocation = (dir, repoName) =>
  `${dir.replace("\n", "")}/src/src/config/repos/${repoName}`;

export const getSetupScriptsLocation = (dir) =>
  `${dir.replace("\n", "")}/src/src/config/setupScript.mjs`;
