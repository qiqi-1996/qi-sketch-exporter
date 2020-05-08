const VERSION = process.argv[2];

if (!VERSION) {
    console.error("No version provided.");
    console.log("Use this command like: npm run publish -- 1.0.0");
    return;
}

/******* Helper Functions *******/

const logger = {
    isProcessing: false,
    process(message) {
        if (!logger.isProcessing) {
            process.stdout.write(`> 💼 ${message} ... `);
        } else {
            let msg = (typeof message === "boolean") ? (message ? "OK" : "FAILED") : message;
            process.stdout.write(`${msg}\n`);
        }
        logger.isProcessing = !logger.isProcessing;
    },
    succeed(message) {
        console.log(`> ✅ ${message}`);
    },
    failed(message) {
        console.error(`> ❌ ${message}`);
    }
}

const fs = require("fs");
const zip = require("cross-zip");
const spawnSync = require("child_process").spawnSync;
const jsonFormat = require("json-format");

const PATH_PLUGIN = __dirname + "/qi-sketch-exporter.sketchplugin";
const PATH_PACKAGEJSON = __dirname + "/package.json";
const PATH_RELEASE = __dirname + `/docs/releases/qi-sketch-exporter@${VERSION}.zip`;

function checkSpawnResult(result) {
    if (result.status) {
        logger.process(false);
        logger.failed(result.stderr.toString());
        process.exit();
    } else {
        logger.process(true);
    }
    
}

logger.process("Cleaning up directory");
try {
    fs.rmdirSync(PATH_PLUGIN, { recursive: true });
    fs.rmdirSync(__dirname + "/interface/dist", { recursive: true });
    fs.rmdirSync(__dirname + "/interface/.cache", { recursive: true });
    fs.rmdirSync(__dirname + "/outcome/dist", { recursive: true });
    fs.rmdirSync(__dirname + "/outcome/.cache", { recursive: true });
    fs.mkdirSync(__dirname + "/interface/dist");
    fs.mkdirSync(__dirname + "/outcome/dist");

    if (fs.existsSync(PATH_RELEASE)) {
        fs.unlinkSync(PATH_RELEASE);
    }
} catch (e) {
    logger.process(false);
    logger.failed(e);
    process.exit();
}
logger.process(true);

logger.process("Modifying the version in project config");
try {
    let json = JSON.parse(fs.readFileSync(PATH_PACKAGEJSON).toString());
    json.version = VERSION;
    fs.writeFileSync(PATH_PACKAGEJSON, jsonFormat(json, { type: 'space', size: 2 }));

    const PATH_GLOBALJS = __dirname + "/docs/global.js";
    let globaljs = fs.readFileSync(PATH_GLOBALJS).toString();
    let winversion = globaljs.match(/window\.VERSION\ ?=\ ?\".*\";/g);
    if (winversion != null) {
        winversion = winversion[0];
    }
    let version = winversion.match(/\".*\"/g)[0].replace(/\"/g, "");
    globaljs = globaljs.replace(winversion, winversion.replace(version, VERSION));
    fs.writeFileSync(PATH_GLOBALJS, globaljs);

} catch (e) {
    logger.process(false);
    logger.failed(e);
    process.exit();
}
logger.process(true);

logger.process("Compiling Plugin Interface");
let CompileInterface = spawnSync("npm", ["run", "build:interface"], {
    cwd: __dirname
});
checkSpawnResult(CompileInterface);

logger.process("Compiling Plugin Outcome");
let CompileOutcome = spawnSync("npm", ["run", "build:outcome"], {
    cwd: __dirname
});
checkSpawnResult(CompileOutcome);

logger.process("Compiling Plugin");
let CompilePlugin = spawnSync("npm", ["run", "build"], {
    cwd: __dirname
});
checkSpawnResult(CompilePlugin);

logger.process("Bundling zip");
try {
    zip.zipSync(PATH_PLUGIN, PATH_RELEASE);
} catch (e) {
    logger.process(false);
    logger.failed(e);
    process.exit();
}
logger.process(true);

logger.succeed("All Done.");