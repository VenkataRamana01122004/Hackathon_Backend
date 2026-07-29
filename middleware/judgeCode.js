const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");
const { randomUUID } = require("crypto");

const judgeCode = ({ language, code, input, expectedOutput }) => {
  return new Promise((resolve) => {
    const id = randomUUID();

    // ---------------- PYTHON ----------------
    if (language === "python") {
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

      if (input) {
        run.stdin.write(input);
      }

      run.stdin.end();

      run.on("close", () => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }

        if (error) {
          return resolve({
            passed: false,
            output: error.trim(),
          });
        }

        resolve({
          passed: output.trim() === String(expectedOutput).trim(),
          output: output.trim(),
        });
      });
    }

    // ---------------- JAVA ----------------

    else if (language === "java") {
      const dir = path.join(__dirname, "../temp", id);

      fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(path.join(dir, "Main.java"), code);

      exec(
        `"C:\\Program Files\\Java\\jdk-17\\bin\\javac.exe" Main.java`,
        { cwd: dir },
        (err, stdout, stderr) => {
          if (err) {
            fs.rmSync(dir, {
              recursive: true,
              force: true,
            });

            return resolve({
              passed: false,
              output: stderr.trim(),
            });
          }

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

          if (input) {
            run.stdin.write(input);
          }

          run.stdin.end();

          run.on("close", () => {
            fs.rmSync(dir, {
              recursive: true,
              force: true,
            });

            if (error) {
              return resolve({
                passed: false,
                output: error.trim(),
              });
            }

            resolve({
              passed: output.trim() === String(expectedOutput).trim(),
              output: output.trim(),
            });
          });
        }
      );
    }

    else {
      resolve({
        passed: false,
        output: "Unsupported language",
      });
    }
  });
};

module.exports = judgeCode;