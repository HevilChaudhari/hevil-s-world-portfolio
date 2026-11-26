import type { Plugin } from 'vite';

/**
 * Emits dist/404.html for GitHub Pages.
 *
 * The site uses hash routing (`/#/resume`), which GitHub Pages serves without
 * any configuration. But a visitor may type or follow a path without the hash
 * (`/my-repo/resume`); GitHub then serves 404.html. This page forwards such
 * paths to their hash form (`/my-repo/#/resume`); unknown paths end on the
 * app's own Not Found page.
 *
 * `basePath` is the site's path on the host: "" for user.github.io or a custom
 * domain, "/my-repo" for a project site. The deploy workflow passes it from
 * actions/configure-pages, so no repository name is hardcoded. Without it
 * (a manual deploy), the page works it out from the known route segments.
 */
export function githubPages404({ basePath, routeSegments }: { basePath: string | undefined; routeSegments: readonly string[] }): Plugin {
  const base = basePath === undefined ? null : basePath.replace(/\/+$/, '');
  return {
    name: 'github-pages-404',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '404.html', source: render404(base, routeSegments) });
    },
  };
}

function render404(base: string | null, routes: readonly string[]): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>HEVIL'S WORLD</title>
    <script>
      (function () {
        var base = ${JSON.stringify(base)};
        var routes = ${JSON.stringify(routes)};
        // Already forwarded once and still not found: stop here (no redirect loop).
        if (location.hash) return;
        var path = location.pathname;
        if (base === null) {
          // Manual deploy: everything before the first known route segment is the base.
          var parts = path.split('/');
          var at = -1;
          for (var i = 1; i < parts.length; i++) if (routes.indexOf(parts[i]) !== -1) { at = i; break; }
          base = at > 0 ? parts.slice(0, at).join('/') : parts.length > 2 ? '/' + parts[1] : '';
        }
        var rest = path.indexOf(base + '/') === 0 ? path.slice(base.length) : path;
        rest = rest.replace(/\\/+$/, '') || '/';
        location.replace(base + '/#' + rest + location.search);
      })();
    </script>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #1f2a24; color: #f6e7c1; font-family: system-ui, sans-serif; }
      a { color: #f4d35e; }
    </style>
  </head>
  <body>
    <p>Page not found. <a href="${base === null ? '/' : `${base}/`}">Go to Hevil&#39;s World</a></p>
  </body>
</html>
`;
}
