export interface BackendSerializable<T> {
  toBackendJson(): Record<string, any>;
}

export abstract class BaseModel<T> implements BackendSerializable<T> {
  abstract toBackendJson(): Record<string, any>;

  static fromBackend<T>(this: new (...args: any[]) => T, data: any): T {
    return new this(data);
  }
}
