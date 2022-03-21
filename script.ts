import * as fs from 'fs';
import { object, array, string } from 'yup';

const FILE_NAME = './index.md';
const MASK_KEY = '{REPO_URL}';
const GITHUB_PREFIX = 'https://github.com/';

const configSchema = object({
  projects: array(
    string().test(
      'repo-name',
      'Repository name is not valid',
      (value) => value.split('/').length === 2,
    ),
  ),
  columns: array(
    object({
      name: string(),
      badge: string().test(
        'badge-mask',
        'Mask is not found in badge',
        (value) => value.includes(MASK_KEY),
      ),
    }),
  ),
});

const getProjectRow = (project: string) =>
  `| [${project.split('/')[1]}](${GITHUB_PREFIX}${project}) | ${config.columns
    .map((col) => `![${col.name}](${col.badge.replace(MASK_KEY, project)})`)
    .join(' | ')} |`;

const config = configSchema.cast(
  JSON.parse(fs.readFileSync('./config.json', 'utf-8')),
);

const content = `# Projects

| Name | ${config.columns.map((col) => col.name).join(' | ')} |
| ---- | ${config.columns.map(() => '----').join(' | ')} |
${config.projects.map(getProjectRow).join('\n')}
`;

fs.writeFileSync(FILE_NAME, content);
