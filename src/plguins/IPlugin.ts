export interface IPlugin {
  init(): Promise<void>;
}
