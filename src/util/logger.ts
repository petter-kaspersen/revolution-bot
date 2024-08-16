function generateTimestamp(): string {
  const date = new Date();

  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `[${hour}:${minutes}:${seconds}]`;
}
class Logger {
  static Info(msg: string): void {
    return console.log(`${generateTimestamp()} [INFO] - ${msg}`);
  }

  static Error(msg: string): void {
    return console.error(`${generateTimestamp()} [ERROR] - ${msg}`);
  }

  static Warning(msg: string): void {
    return console.warn(`${generateTimestamp()} [WARNING] - ${msg}`);
  }
}

export default Logger;
