import { readFileSync, appendFileSync, writeFileSync, existsSync } from "fs";

const loadOrCeateCache = (): Map<string, any> => {
  if (!existsSync("cache.json")) {
    appendFileSync("cache.json", "{}");
    return new Map();
  }

  try {
    const data = readFileSync("cache.json", "utf8");
    return new Map(JSON.parse(data));
  } catch (err) {
    return new Map();
  }
};

export class Cache {
  private static cache: Map<string, any> = new Map();

  constructor() {
    Cache.cache = loadOrCeateCache();
  }

  private static saveCache(): void {
    writeFileSync("cache.json", JSON.stringify([...this.cache]));
  }

  public static set(key: string, value: any): void {
    this.cache.set(key, value);
    this.saveCache();
  }

  public static get(key: string): any {
    return this.cache.get(key);
  }

  public static delete(key: string): void {
    this.cache.delete(key);
    this.saveCache();
  }
}
