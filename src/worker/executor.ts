import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { v4 as uuidv4 } from "uuid";

const unlinkAsync = util.promisify(fs.unlink);

const languageConfig: Record<string, { ext: string; command: string }> = {
  python: { ext: "py", command: "python3" },
  javascript: { ext: "js", command: "node" },
  typescript: { ext: "ts", command: "node" },
};

export const executeCode = async (
  code: string,
  language: string,
  testCases: { input: string; expectedOutput: string }[]
) => {
  const config = languageConfig[language];

  if (!config) {
    console.error("Unsupported language:", language);
    return { error: "Unsupported language" };
  }

  const tempFilename = `${uuidv4()}.${config.ext}`;
  const tempFilePath = path.join(process.cwd(), tempFilename);
  console.log("Creating temp file at:", tempFilePath);

  try {
    fs.writeFileSync(tempFilePath, code, { flag: "w" });
    fs.chmodSync(tempFilePath, 0o755);

    if (!fs.existsSync(tempFilePath)) {
      console.error("File not found:", tempFilePath);
      return { error: "Temporary file was not created" };
    }

    console.log("File content:", fs.readFileSync(tempFilePath, "utf-8"));

    const results = [];

    for (const testCase of testCases) {
      try {
        console.log("Executing command:", `${config.command} ${tempFilePath}`);

        const process = spawn(config.command, [tempFilePath], {
          stdio: ["pipe", "pipe", "pipe"],
        });

        let output = "";
        let errorOutput = "";

        process.stdin.write(testCase.input + "\n");
        process.stdin.end();

        process.stdout.on("data", (data) => {
          output += data.toString();
        });

        process.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });

        await new Promise((resolve) => process.on("close", resolve));

        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: output.trim(),
          success: output.trim() === testCase.expectedOutput,
          error: errorOutput.trim() || null,
        });
      } catch (error: any) {
        results.push({
          input: testCase.input,
          error: error.message || "Execution failed",
        });
      }
    }

    await unlinkAsync(tempFilePath);
    console.log("Deleted temp file.");
    return results;
  } catch (error: any) {
    console.error("Execution error:", error);
    if (fs.existsSync(tempFilePath)) {
      await unlinkAsync(tempFilePath);
    }
    return { error: error.message || "Execution failed" };
  }
};
