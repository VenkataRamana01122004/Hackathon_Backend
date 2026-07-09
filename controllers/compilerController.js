const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");
const { randomUUID } = require("crypto");

exports.compileCode = (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({
      message: "Language and code are required",
    });
  }

  const id = randomUUID();

  // ---------------- JAVA ----------------

  if (language === "java") {
  const dir = path.join(__dirname, "../temp", id);

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, "Main.java"), code);

  // Compile
  exec(
    `"C:\\Program Files\\Java\\jdk-17\\bin\\javac.exe" Main.java`,
    { cwd: dir },
    (err, stdout, stderr) => {
      if (err) {
        fs.rmSync(dir, { recursive: true, force: true });

        return res.json({
          output: stderr,
        });
      }

      // Run
      const run = spawn(
        "C:\\Program Files\\Java\\jdk-17\\bin\\java.exe",
        ["Main"],
        { cwd: dir }
      );

      let output = "";
      let error = "";

      run.stdout.on("data", (data) => {
        output += data.toString();
      });

      run.stderr.on("data", (data) => {
        error += data.toString();
      });

      // Send custom input
      if (req.body.input) {
        run.stdin.write(req.body.input);
      }

      run.stdin.end();

      run.on("close", () => {
        fs.rmSync(dir, { recursive: true, force: true });

        res.json({
          output: error || output,
        });
      });
    }
  );
}
  // ---------------- PYTHON ----------------
  else if (language === "python") {
  const file = path.join(__dirname, "../temp", `${id}.py`);

  fs.writeFileSync(file, code);

  const run = spawn("python", [file]);

  let output = "";
  let error = "";

  run.stdout.on("data", (data) => {
    output += data.toString();
  });

  run.stderr.on("data", (data) => {
    error += data.toString();
  });

  // Send custom input
  if (req.body.input) {
    run.stdin.write(req.body.input);
  }

  run.stdin.end();

  run.on("close", () => {
    fs.unlinkSync(file);

    res.json({
      output: error || output,
    });
  });
}
  // ---------------- INVALID ----------------
  else {
    res.status(400).json({
      output: "Unsupported language",
    });
  }
};