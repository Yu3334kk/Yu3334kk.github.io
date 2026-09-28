import type { ReactNode } from "react";
import { Particles } from "./components/Particles";
import { Terminal } from "./components/Terminal";
import { content } from "./content";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 sm:mt-14">
      <h2 className="mb-5 flex items-center gap-3 text-sm text-dim">
        <span className="text-accent">#</span>
        {title}
        <span className="h-px flex-1 bg-line" />
      </h2>
      {children}
    </section>
  );
}

export function App() {
  return (
    <>
      <Particles />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            {content.name}
            <span className="caret-bar ml-1.5" aria-hidden />
          </h1>
          <p className="mt-2 text-sm text-dim">
            {content.school} · {content.tagline}
          </p>
        </header>

        <Terminal />

        <Section title="关于我">
          <div className="space-y-2 text-sm leading-relaxed text-fg/80">
            {content.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>

        <Section title="我现在在做什么">
          {/* 手机上三张卡竖排要吃掉 367px，改成横滑，下一张露一截做提示 */}
          <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {content.focus.map((f) => (
              <li
                key={f.title}
                className="w-[78vw] max-w-[280px] shrink-0 snap-start rounded-lg border border-line bg-panel p-4 sm:w-auto sm:max-w-none"
              >
                <p className="text-sm text-fg">{f.title}</p>
                <p className="mt-1 text-xs text-accent">{f.status}</p>
                <p className="mt-2 text-xs leading-relaxed text-dim">{f.note}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="我会什么">
          <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-panel">
            {content.skills.map((s) => (
              <li key={s.name} className="px-4 py-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm text-fg">{s.name}</span>
                  <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-accent2">
                    {s.level}
                  </span>
                </div>
                <p className="mt-1 text-xs text-dim">{s.note}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="不写代码的时候">
          <ul className="space-y-3 text-sm">
            {content.interests.map((i) => (
              <li key={i.name}>
                <p className="text-fg">{i.name}</p>
                <p className="mt-0.5 text-xs text-dim">{i.note}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="这个页面是怎么做出来的">
          <ol className="space-y-4 border-l border-line pl-5">
            {content.process.map((p, i) => (
              <li key={p.title} className="relative">
                <span className="absolute -left-[24px] top-1.5 size-2 rounded-full bg-accent/70" />
                <p className="text-sm text-fg">
                  <span className="mr-2 text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-dim">{p.note}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs">
            <a
              href={`https://github.com/${content.repo}/commits/main`}
              target="_blank"
              rel="noreferrer"
              className="text-accent2 hover:underline"
            >
              完整过程在 commit 记录里 →
            </a>
          </p>
        </Section>

        <Section title="找到我">
          <div className="space-y-2 rounded-lg border border-line bg-panel px-4 py-4 text-sm">
            <p className="text-dim">
              微信 <span className="text-fg">{content.contact.wechat}</span>
            </p>
            {content.contact.github && (
              <p className="text-dim">
                GitHub{" "}
                <a
                  href={`https://github.com/${content.contact.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent2 hover:underline"
                >
                  @{content.contact.github}
                </a>
              </p>
            )}
          </div>
        </Section>

        <footer className="mt-14 border-t border-line pt-5 text-xs text-dim">
          这个页面是 Vibe AI Lab 的考核作品，也是我用 AI 协作现学前端做出来的一份学习记录。
        </footer>
      </div>
    </>
  );
}
