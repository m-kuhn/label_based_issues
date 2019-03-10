import { Application, Context } from "probot";

import { label_based_issues } from "./label_based_issues";

const applicationFunction = (app: Application) => {
  app.log("App loaded");

  app.on(
    ["pull_request.labeled", "pull_request.closed"],
    async (context: Context) => {
      const { payload, github: octokit } = context;
      const { number: pullRequestNumber, owner, repo } = context.issue();
      await label_based_issues({
        // @ts-ignore The value is the good one even if the type doesn't match.
        octokit,
        owner,
        payload,
        pullRequestNumber,
        repo,
      });
    },
  );
};

export { applicationFunction };
