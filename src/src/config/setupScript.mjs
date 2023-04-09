import fs from "fs/promises";

import { exec } from "child_process";
import { appRepoNameMapping, appRepoGitUrlMapping } from "./apps.mjs";

(async () => {
  const appName = process.argv.at(-1);
  const repo = appRepoNameMapping[appName];
  const repoGit = appRepoGitUrlMapping[appName];
  const repoPath = `${process.cwd()}/src/src/config/repos/${repo}`;

  // look for project
  const isExists = await fs.stat(repoPath).catch((err) => {
    if (err.code === "ENOENT") return false;
  });

  if (!isExists) {
    const isRepoGenerated = await new Promise((resolve, reject) => {
      exec(
        `git clone ${repoGit} ${repoPath} && cd ${repoPath} && yarn`,
        (err, res) => {
          if (err) reject(err);
          if (res.includes("Done in ")) resolve(res);
        }
      );
    });

    console.log(isRepoGenerated);
  } else {
    // Update repo
    exec(
      `cd ${repoPath} && git reset --hard HEAD && git fetch && git pull --rebase && git fetch origin && git pull origin`,
      (err, res) => {
        if (err) console.log(err);
        console.log(res);
      }
    );
  }
})();
