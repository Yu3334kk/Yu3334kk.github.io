import type { ReactNode } from "react";
import { Terminal } from "./components/Terminal";
import { content } from "./content";

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-5 flex items-baseline gap-3 border-t border-rule pt-3">
        <span className="font-mono text-[11px] text-accent">{n}</span>
        <h2 className="font-serif text-lg text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

/** 手机上竖排会吃掉大量高度，改成横滑；桌面是并排列。用顶部细线代替卡片框。 */
function Columns({ children }: { children: ReactNode }) {
  return (
    <ul className="-mx-4 flex snap-x gap-6 overflow-x-auto px-4 scroll-pl-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:scroll-p-0 sm:px-0 sm:pb-0">
      {children}
    </ul>
  );
}

function Column({ children }: { children: ReactNode }) {
  return (
    <li className="w-[78vw] max-w-[300px] shrink-0 snap-start border-t border-rule pt-3 sm:w-auto sm:max-w-none">
      {children}
    </li>
  );
}

export function App() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20">
      <header className="border-b border-rule pb-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted">
          自我介绍 · 2026 · 杭州
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-none text-ink sm:text-5xl">
          {content.name}
          <span className="caret-bar ml-2" aria-hidden />
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          {content.school}
          <br />
          {content.tagline}
        </p>
      </header>

      <Terminal />

      <Section n="01" title="关于我">
        <div className="space-y-3 text-[15px] leading-relaxed text-ink/85">
          {content.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      <Section n="02" title="我现在在做什么">
        <Columns>
          {content.focus.map((f) => (
            <Column key={f.title}>
              <p className="font-serif text-base text-ink">{f.title}</p>
              <p className="mt-1 font-mono text-[11px] tracking-wide text-accent">
                {f.status}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{f.note}</p>
            </Column>
          ))}
        </Columns>
      </Section>

      <Section n="03" title="我会什么">
        <ul className="divide-y divide-rule border-y border-rule">
          {content.skills.map((s) => (
            <li key={s.name} className="flex flex-wrap items-baseline gap-x-3 py-3">
              <span className="font-serif text-base text-ink">{s.name}</span>
              <span className="font-mono text-[11px] text-accent">{s.level}</span>
              <span className="w-full text-xs text-muted sm:ml-auto sm:w-auto sm:text-right">
                {s.note}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section n="04" title="不写代码的时候">
        <ul className="space-y-3">
          {content.interests.map((i) => (
            <li key={i.name}>
              <span className="font-serif text-base text-ink">{i.name}</span>
              <span className="ml-3 text-xs text-muted">{i.note}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section n="05" title="我和 AI 怎么分工">
        <p className="mb-5 text-sm text-muted">
          一句话：<span className="text-ink">我负责判断要不要、对不对；怎么写交给它。</span>
        </p>
        <Columns>
          {content.division.map((g) => (
            <Column key={g.who}>
              <p className="font-mono text-[11px] tracking-[0.14em] text-accent">
                {g.who}
              </p>
              <ul className="mt-3 space-y-2.5">
                {g.items.map((t) => (
                  <li key={t} className="text-xs leading-relaxed text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </Column>
          ))}
        </Columns>
        <p className="mt-6 text-xs">
          <a
            href={`https://github.com/${content.repo}/commits/main`}
            target="_blank"
            rel="noreferrer"
            className="text-accent underline decoration-rule underline-offset-4 hover:decoration-accent"
          >
            完整过程在 commit 记录里，也可以在终端敲 log →
          </a>
        </p>
      </Section>

      <Section n="06" title="找到我">
        <dl className="space-y-2 text-sm">
          <div className="flex gap-4">
            <dt className="w-16 font-mono text-[11px] text-muted">微信</dt>
            <dd className="text-ink">{content.contact.wechat}</dd>
          </div>
          {content.contact.github && (
            <div className="flex gap-4">
              <dt className="w-16 font-mono text-[11px] text-muted">GitHub</dt>
              <dd>
                <a
                  href={`https://github.com/${content.contact.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline decoration-rule underline-offset-4 hover:decoration-accent"
                >
                  @{content.contact.github}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </Section>

      <footer className="mt-14 border-t border-rule pt-4 text-xs leading-relaxed text-muted">
        这个页面是 Vibe AI Lab 的考核作品，也是我用 AI 协作现学前端做出来的一份学习记录。
      </footer>
    </div>
  );
}
