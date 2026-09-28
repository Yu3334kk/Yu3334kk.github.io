// 把 dist/ 推到 Netlify。用官方文件摘要接口，不依赖第三方 Action。
// 需要环境变量 NETLIFY_AUTH_TOKEN；站点 ID 直接写在下面的 SITE 里。

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const TOKEN = process.env.NETLIFY_AUTH_TOKEN;
const SITE = "a76fc365-cd67-4554-abeb-5c7258b546a9"; // yuzhuoyan.netlify.app
const DIR = "dist";

function collect(dir) {
  const digests = {};
  const buffers = new Map();
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else {
        const path = "/" + relative(dir, p).split(sep).join("/");
        const buf = readFileSync(p);
        digests[path] = createHash("sha1").update(buf).digest("hex");
        buffers.set(path, buf);
      }
    }
  };
  walk(dir);
  return { digests, buffers };
}

async function main() {
  if (!TOKEN) throw new Error("缺少 NETLIFY_AUTH_TOKEN");

  const { digests, buffers } = collect(DIR);
  const api = (path, init = {}) =>
    fetch(`https://api.netlify.com/api/v1${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${TOKEN}`, ...(init.headers ?? {}) },
    });

  const created = await api(`/sites/${SITE}/deploys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files: digests }),
  });
  if (!created.ok) throw new Error(`创建 deploy 失败 ${created.status}: ${await created.text()}`);

  const deploy = await created.json();
  const required = deploy.required ?? [];
  console.log(`deploy ${deploy.id} 状态 ${deploy.state}，待上传 ${required.length} 个文件`);

  const bySha = new Map(Object.entries(digests).map(([p, sha]) => [sha, p]));
  for (const sha of required) {
    const path = bySha.get(sha);
    if (!path) throw new Error(`收到未知文件摘要 ${sha}`);
    const put = await api(`/deploys/${deploy.id}/files${path}`, {
      method: "PUT",
      body: buffers.get(path),
    });
    if (!put.ok) throw new Error(`上传 ${path} 失败 ${put.status}: ${await put.text()}`);
    console.log(`上传 ${path}`);
  }

  await api(`/sites/${SITE}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ published: true }),
  });

  const site = await (await api(`/sites/${SITE}`)).json();
  console.log(`Netlify 已更新: ${site.ssl_url ?? site.url}`);
}

main().catch((err) => {
  console.error(`Netlify 同步失败: ${err.message}`);
  // 用 exitCode 而不是 process.exit，避免 Windows 上 socket 未关完就强退导致的断言崩溃
  process.exitCode = 1;
});
