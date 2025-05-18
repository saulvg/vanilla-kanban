const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../api/.env") });

const config = {
	API_BASE: `${process.env.BASE_URL}${process.env.PORT}${process.env.API_PREFIX}/tasks`,
};

const target = path.resolve(__dirname, "../public/scripts/env.js");
fs.writeFileSync(
	target,
	`// ⚙️ generado automáticamente\nwindow._env_ = ${JSON.stringify(config, null, 2)};\n`,
);

console.log("✅ env.js generado en public/scripts/env.js");
