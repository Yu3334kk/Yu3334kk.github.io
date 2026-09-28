import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { content } from "../content";

type Line = { kind: "cmd" | "out" | "note"; text: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const out = (...texts: string[]): Line[] => texts.map((text) => ({ kind: "out", text }));
const note = (...texts: string[]): Line[] => texts.map((text) => ({ kind: "note", text }));

// 终端里只放短行：长句子在窄容器里会断得难看（试过），完整段落交给 about 命令和下方区块。
// 中文在等宽字体里的实际宽度和 ASCII 不一致，靠空格排版一定对不齐，
// 所以并列信息统一用 · 分隔，不做列对齐。
const intro: Line[] = [
  { kind: "cmd", text: "whoami" },
  ...out(content.name, content.school, `定位 · ${content.tagline}`),
  { kind: "cmd", text: "ls ./now" },
  ...out(...content.focus.map((f) => `${f.title} · ${f.status}`)),
  ...note("想知道更多 · 敲 about / log / contact"),
];

type Command = { desc: string; run?: () => Line[] };

const commands: Record<string, Command> = {
  help: {
    desc: "列出能问的命令",
    // 命令名都是 ASCII，这里 padEnd 是对齐的
    run: () => out(...Object.entries(commands).map(([name, c]) => `${name.padEnd(9)} ${c.desc}`)),
  },
  whoami: {
    desc: "我是谁",
    run: () => out(content.name, content.school, `定位 · ${content.tagline}`),
  },
  about: { desc: "关于我", run: () => out(...content.about) },
  skills: {
    desc: "我会什么（说实话版）",
    run: () => out(...content.skills.map((s) => `${s.name} · ${s.level} · ${s.note}`)),
  },
  now: {
    desc: "我正在做的事",
    run: () => out(...content.focus.map((f) => `${f.title} · ${f.status} · ${f.note}`)),
  },
  interests: {
    desc: "不写代码的时候在干什么",
    run: () => out(...content.interests.map((i) => `${i.name} · ${i.note}`)),
  },
  contact: {
    desc: "怎么找到我",
    run: () =>
      out(
        `微信 · ${content.contact.wechat}`,
        ...(content.contact.github ? [`GitHub · ${content.contact.github}`] : []),
      ),
  },
  log: {
    desc: "这个页面的提交记录",
    // 哈希是 ASCII，这里 padEnd 能对齐
    run: () => [
      ...out(...content.commits.map((c) => `${c.hash.padEnd(8)} ${c.text}`)),
      ...note(`完整记录 → github.com/${content.repo}/commits/main`),
    ],
  },
  clear: { desc: "清空屏幕" },
};

function lookup(raw: string): Line[] {
  const entry = commands[raw];
  if (entry?.run) return entry.run();
  return out(`command not found: ${raw}`, "输入 help 看看能问什么。");
}

export function Terminal() {
  const [shown, setShown] = useState<Line[]>([]);
  const [typed, setTyped] = useState("");
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const skipRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string[]>([]);
  // 等于 historyRef.current.length 时表示"还没翻到历史"，即当前空输入行
  const histPos = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const line of intro) {
        if (cancelled) return;
        if (line.kind === "out") {
          if (!skipRef.current) await sleep(80);
          setShown((prev) => [...prev, line]);
          continue;
        }
        for (let i = 0; i <= line.text.length; i++) {
          if (cancelled) return;
          setTyped(line.text.slice(0, i));
          if (!skipRef.current) await sleep(36);
        }
        if (!skipRef.current) await sleep(200);
        if (cancelled) return;
        setShown((prev) => [...prev, line]);
        setTyped("");
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 新输出出现时滚到底，像真终端那样；不这么做的话手机端连点几条命令就看不到自己的结果了
  useEffect(() => {
    const box = boxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [shown]);

  function submit(raw: string) {
    const cmd = raw.trim().toLowerCase();
    setValue("");
    if (!cmd) return;
    if (cmd === "clear") {
      setShown([]);
      return;
    }
    historyRef.current.push(cmd);
    histPos.current = historyRef.current.length;
    setShown((prev) => [...prev, { kind: "cmd", text: cmd }, ...lookup(cmd)]);
  }

  function complete() {
    const prefix = value.trim().toLowerCase();
    const hits = Object.keys(commands).filter((k) => k.startsWith(prefix));
    if (hits.length === 1) {
      setValue(hits[0]);
      return;
    }
    if (hits.length === 0) return;
    const common = hits.reduce((a, b) => {
      let i = 0;
      while (i < a.length && a[i] === b[i]) i++;
      return a.slice(0, i);
    });
    if (common.length > prefix.length) setValue(common);
    else
      setShown((prev) => [
        ...prev,
        { kind: "cmd", text: `tab ${prefix}` },
        ...out(hits.join("   ")),
      ]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const hist = historyRef.current;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!hist.length) return;
      e.preventDefault();
      histPos.current =
        e.key === "ArrowUp"
          ? Math.max(0, histPos.current - 1)
          : Math.min(hist.length, histPos.current + 1);
      setValue(histPos.current === hist.length ? "" : hist[histPos.current]);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      complete();
    }
  }

  function wake() {
    skipRef.current = true;
    if (ready) inputRef.current?.focus();
  }

  return (
    <div className="mt-8 border border-rule bg-raised" onClick={wake}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-4 py-2 sm:px-5">
        <span className="text-[10px] tracking-[0.18em] text-muted">终端</span>
        <span className="text-[10px] text-muted">输入命令 · Tab 补全 · ↑↓ 历史</span>
      </div>

      <div
        ref={boxRef}
        className="max-h-[70vh] min-h-[240px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:min-h-[280px] sm:px-5"
      >
        {shown.map((line, i) =>
          line.kind === "cmd" ? (
            <p key={i} className="mt-3 first:mt-0">
              <span className="text-accent">$ </span>
              <span className="text-ink">{line.text}</span>
            </p>
          ) : line.kind === "note" ? (
            <p key={i} className="whitespace-pre-wrap pl-5 text-accent">
              {line.text}
            </p>
          ) : (
            <p key={i} className="whitespace-pre-wrap pl-5 text-muted">
              {line.text}
            </p>
          ),
        )}

        {ready ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
            className="mt-3 flex items-baseline"
          >
            <label htmlFor="term" className="text-accent">
              $&nbsp;
            </label>
            <input
              id="term"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
              placeholder="输入命令"
              className="min-w-0 flex-1 border-none bg-transparent text-ink caret-accent outline-none placeholder:text-muted/50"
            />
          </form>
        ) : (
          <p className="mt-3 caret">
            <span className="text-accent">$ </span>
            <span className="text-ink">{typed}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-rule px-4 py-3 sm:px-5">
        {Object.keys(commands).map((name) => (
          <button
            key={name}
            type="button"
            disabled={!ready}
            onClick={(e) => {
              e.stopPropagation();
              skipRef.current = true;
              submit(name);
            }}
            className="border border-rule px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-rule disabled:hover:text-muted"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
