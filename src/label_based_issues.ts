import * as Octokit from "@octokit/rest";
import {
  PullRequestNumber,
  RepoName,
  RepoOwner,
} from "shared-github-internals/lib/git";

type LabelName = string;

type Label = { name: LabelName };

type Payload = {
  label?: Label;
  pull_request: {
    labels: Label[];
    merged: boolean;
  };
};

const regExp = /^feature$/;

const label_based_issues = async ({
  octokit,
  owner,
  payload,
  pullRequestNumber,
  repo,
}: {
  octokit: Octokit;
  owner: RepoOwner;
  payload: Payload;
  pullRequestNumber: PullRequestNumber;
  repo: RepoName;
}) => {
  const labelName = payload.pull_request.labels
    .map(({ name }) => name)
    .find(name => regExp.test(name));
  if (
    !labelName ||
    !payload.pull_request.merged ||
    (payload.label && !regExp.test(payload.label.name))
  ) {
    // Ignore unlabeled or unmerged pull requests and unrelated label events.
    return;
  }
  await octokit.issues.createIssue({
    body: [
      `The backport to \`${base}\` failed:`,
      "",
      "```",
      error.message,
      "```",
    ].join("\n"),
    number: pullRequestNumber,
    owner,
    repo,
  });
};

export { label_based_issues, Label };
