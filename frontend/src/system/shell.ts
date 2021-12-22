async function shell(cmd: string): Promise<string> {
  try {
    const item = await import(`./root/${cmd}`);
    return item.default();
  } catch {
    return `bash: ${cmd}: command not found...`;
  }
}

export default shell;
