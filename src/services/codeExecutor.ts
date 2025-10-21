interface ExecutionResult {
  output: string[];
  error?: string;
  durationMs: number;
}

export function executeCode(code: string): ExecutionResult {
  const output: string[] = [];
  const wrappedConsole = {
    log: (...args: unknown[]) => output.push(args.map(String).join(' ')),
    error: (...args: unknown[]) => output.push(args.map(String).join(' ')),
    warn: (...args: unknown[]) => output.push(args.map(String).join(' '))
  };

  const start = performance.now();
  try {
    const fn = new Function('console', `'use strict';\n${code}`);
    fn(wrappedConsole);
    return { output, durationMs: performance.now() - start };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { output, error: message, durationMs: performance.now() - start };
  }
}
