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

        <Section title="我和 AI 怎么分工">
          <p className="mb-4 text-sm text-dim">
            一句话：<span className="text-fg">我负责判断要不要、对不对；怎么写交给它。</span>
          </p>
          <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {content.division.map((g) => (
              <li
                key={g.who}
                className="w-[80vw] max-w-[300px] shrink-0 snap-start rounded-lg border border-line bg-panel p-4 sm:w-auto sm:max-w-none"
              >
                <p className="text-sm text-accent">{g.who}</p>
                <ul className="mt-2 space-y-2">
                  {g.items.map((t) => (
                    <li key={t} className="text-xs leading-relaxed text-dim">
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs">
            <a
              href={`https://github.com/${content.repo}/commits/main`}
              target="_blank"
              rel="noreferrer"
              className="text-accent2 hover:underline"
            >
              完整过程在 commit 记录里，也可以在终端敲 log →
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
