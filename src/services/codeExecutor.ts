interface ExecutionResult {
  stdout: string;
  stderr: string;
}

export const executeCodeSafely = async (code: string): Promise<ExecutionResult> => {
  try {
    // Limited sandbox using Function constructor. In production this should run in a secure worker/sandbox.
    // eslint-disable-next-line no-new-func
    const result = new Function(`${code}`)();
    return {
      stdout: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
      stderr: ''
    };
  } catch (error) {
    return {
      stdout: '',
      stderr: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
