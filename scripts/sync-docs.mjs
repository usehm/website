// Copies the protocol references from the hm repository (../hm/docs by
// default, or HM_REPO) into content/docs, so the site builds without the
// repository next to it. Run it after those files change: npm run sync-docs.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const repo = path.resolve(root, process.env.HM_REPO ?? '../hm');

const files = [
  {
    src: 'docs/rpc.md',
    dst: 'rpc.md',
    front: { title: 'RPC protocol', description: 'Drive an hm agent session from another program over JSON lines.', section: 'Automation', order: 2 },
  },
  {
    src: 'docs/events.md',
    dst: 'events.md',
    front: { title: 'JSON events', description: 'The event stream written by hm agent --output json and --rpc.', section: 'Automation', order: 3 },
  },
];

const links = [
  [/\]\(events\.md\)/g, '](/docs/events/)'],
  [/\]\(rpc\.md\)/g, '](/docs/rpc/)'],
  [/\]\(\.\.\/examples\/([^)]+)\)/g, '](https://github.com/mirzakhany/hm/blob/main/examples/$1)'],
];

for (const f of files) {
  let md = await readFile(path.join(repo, f.src), 'utf8');
  md = md.replace(/^# .*\n+/, ''); // the page title comes from the front matter
  for (const [re, to] of links) md = md.replace(re, to);
  const front = Object.entries(f.front).map(([k, v]) => `${k}: ${v}`).join('\n');
  const note = `<!-- Synced from github.com/mirzakhany/hm/${f.src} by scripts/sync-docs.mjs; edit it there. -->`;
  await writeFile(path.join(root, 'content/docs', f.dst), `---\n${front}\n---\n${note}\n\n${md}`);
  console.log(`synced ${f.src} -> content/docs/${f.dst}`);
}
