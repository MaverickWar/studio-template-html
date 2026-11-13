// Made by Universal App Studio. Reads design/tokens.json and adds the colours, fonts, corners and
// spacing to the page as CSS variables (--studio-bg, --studio-primary, --studio-font-body and so on).
// Add it to every page's <head>:
//   <script src="design/adapters/html/studio-theme.js"></script>
// Change the look in Studio (it rewrites design/tokens.json), never here.
// Browsers won't read files from a page opened straight from disk, so preview with a small local
// server, for example: npx serve .
// Extras: any element with data-studio-name shows the project's name, <html> gets
// data-studio-ready once the look is applied, and the tokens are on window.studioTokens.
(function () {
  var script = document.currentScript;
  var url = new URL("../../tokens.json", script && script.src ? script.src : location.href);
  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (t) {
      var vars = [];
      Object.keys(t.color).forEach(function (k) { vars.push("--studio-" + k + ":" + t.color[k]); });
      vars.push("--studio-font-display:'" + t.font.display + "', Georgia, serif");
      vars.push("--studio-font-body:'" + t.font.body + "', system-ui, sans-serif");
      Object.keys(t.radius).forEach(function (k) { vars.push("--studio-radius-" + k + ":" + t.radius[k]); });
      t.space.forEach(function (v, i) { vars.push("--studio-space-" + (i + 1) + ":" + v + "px"); });
      vars.push("--studio-max-width:" + ((t.layout && t.layout.maxWidth) || "1200px"));
      var style = document.createElement("style");
      style.id = "studio-theme";
      style.textContent = ":root{" + vars.join(";") + "}";
      document.head.appendChild(style);
      var families = [t.font.display, t.font.body].filter(function (f, i, all) { return all.indexOf(f) === i; });
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?" + families.map(function (f) {
        return "family=" + encodeURIComponent(f).replace(/%20/g, "+") + ":wght@400;600;700";
      }).join("&") + "&display=swap";
      document.head.appendChild(link);
      window.studioTokens = t;
      whenReady(function () {
        if (t.name) document.querySelectorAll("[data-studio-name]").forEach(function (el) { el.textContent = t.name; });
      });
    })
    .catch(function () { /* The page keeps its own fallback colours. */ })
    .then(function () { document.documentElement.setAttribute("data-studio-ready", ""); });
  function whenReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
})();
