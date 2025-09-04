import { build } from "esbuild";
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

await build({
	  entryPoints: [path.join(__dirname, "client.js")],
	  outfile: path.join(__dirname, "bundle.js"),
	  bundle: true,
	  format: "esm",
	  sourcemap: "inline",
});

const server = http.createServer(async (req, res) => {
	  const file = req.url === "/bundle.js" ? "bundle.js"
	             : req.url === "/deps.json" ? "deps.json"
	             : "index.html";
	  try {
		      const data = await fs.readFile(path.join(__dirname, file));
		      res.writeHead(200, { "content-type":
			            file.endsWith(".js") ? "text/javascript" :
			            file.endsWith(".json") ? "application/json" : "text/html" });
		      res.end(data);
		    } catch { res.writeHead(404); res.end("not found"); }
});
server.listen(3000, () => console.log("open → http://127.0.0.1:3000"));
