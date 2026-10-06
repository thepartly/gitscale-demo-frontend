import { useState, type FormEvent } from "react";
import { hello as helloA } from "@gitscale-demo/application-a-sdk";
import { hello as helloB } from "@gitscale-demo/application-b-sdk";

type Page = "a" | "b";

/** A greeting, from whichever application the page asks. */
async function greet(page: Page, name: string): Promise<string> {
  if (page === "a") {
    const reply = await helloA(name);
    return `${reply.message} (greeting number ${reply.count})`;
  }
  return (await helloB(name)).message;
}

export function App() {
  const page: Page = window.location.pathname.startsWith("/b") ? "b" : "a";
  const [name, setName] = useState("world");
  const [reply, setReply] = useState<string>();
  const [error, setError] = useState<string>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(undefined);
    try {
      setReply(await greet(page, name));
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <main>
      <nav>
        <a href="/a" aria-current={page === "a" ? "page" : undefined}>
          application-a
        </a>
        <a href="/b" aria-current={page === "b" ? "page" : undefined}>
          application-b
        </a>
      </nav>
      <h1>Hello from application-{page}</h1>
      <form onSubmit={submit}>
        <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" />
        <button type="submit">Greet</button>
      </form>
      {reply && <p className="reply">{reply}</p>}
      {error && <p className="error">{error}</p>}
    </main>
  );
}
