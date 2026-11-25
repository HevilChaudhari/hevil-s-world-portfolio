import type { ApiEndpoint, HttpMethod } from '@/types/project';

const METHOD_STYLES: Record<HttpMethod, string> = {
  GET: 'bg-grass text-white',
  POST: 'bg-[#4f7cac] text-white',
  PUT: 'bg-[#c07f25] text-white',
  PATCH: 'bg-[#7a4f7f] text-white',
  DELETE: 'bg-sunset text-white',
};

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-soil">{label}</p>
      <pre className="overflow-x-auto bg-night p-3 text-xs leading-relaxed text-parchment">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** Endpoint reference: method, path, summary, auth, examples, status codes. */
export function ApiDocs({ endpoints }: { endpoints: readonly ApiEndpoint[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {endpoints.map((ep) => (
        <li key={`${ep.method} ${ep.path}`} className="bg-white p-4 pixel-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 font-mono text-xs font-bold ${METHOD_STYLES[ep.method]}`}>{ep.method}</span>
            <code className="break-all font-mono text-sm font-bold">{ep.path}</code>
          </div>
          <p className="mt-2">{ep.summary}</p>
          {ep.auth && (
            <p className="mt-1 text-sm text-soil">
              <span className="font-semibold">Auth:</span> {ep.auth}
            </p>
          )}
          {(ep.request || ep.response) && (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {ep.request && <CodeBlock label="Request" code={ep.request} />}
              {ep.response && <CodeBlock label="Response" code={ep.response} />}
            </div>
          )}
          {ep.statusCodes && ep.statusCodes.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Status codes">
              {ep.statusCodes.map((s) => (
                <li key={s} className="bg-parchment px-2 py-0.5 font-mono text-xs">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
