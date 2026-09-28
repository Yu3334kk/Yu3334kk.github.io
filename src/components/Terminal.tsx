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
    desc: "这个页面是怎么做出来的",
    run: () =>
      content.process.flatMap((p, i) => out(`${i + 1}. ${p.title}`, p.note)),
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
    <div
      className="overflow-hidden rounded-lg border border-line bg-panel shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_60px_-24px_rgba(0,0,0,0.9)]"
      onClick={wake}
    >
      <div className="flex items-center gap-2 border-b border-line bg-ink/60 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-xs text-dim">yu@hzd — 自我介绍</span>
      </div>

      <div className="min-h-[300px] px-4 py-4 text-[13px] leading-relaxed sm:min-h-[330px] sm:px-6 sm:text-sm">
        {shown.map((line, i) =>
          line.kind === "cmd" ? (
            <p key={i} className="mt-3 first:mt-0">
              <span className="text-accent">$ </span>
              <span className="text-fg">{line.text}</span>
            </p>
          ) : line.kind === "note" ? (
            <p key={i} className="whitespace-pre-wrap pl-5 text-accent2">
              {line.text}
            </p>
          ) : (
            <p key={i} className="whitespace-pre-wrap pl-5 text-dim">
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
              className="min-w-0 flex-1 border-none bg-transparent text-fg caret-accent outline-none placeholder:text-dim/45"
            />
          </form>
        ) : (
          <p className="mt-3 caret">
            <span className="text-accent">$ </span>
            <span className="text-fg">{typed}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-line bg-ink/40 px-4 py-3 sm:px-6">
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
            className="rounded border border-line px-2 py-1 text-[11px] text-dim transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-40 disabled:hover:border-line disabled:hover:text-dim"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
