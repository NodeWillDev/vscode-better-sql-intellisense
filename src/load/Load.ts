import { DatabaseType, ILoad, LoadDataType } from "./ILoad";
import { LoadLocalDatabase } from "./local/LoadLocalDatabase";
import { LoadRemoteDatabase } from "./remote/LoadRemoteDatabase";

export class Load implements ILoad {
  public data: LoadDataType = {};

  private loads: ILoad[] = [];

  public async init(): Promise<void> {
    this.loads.push(new LoadRemoteDatabase());
    this.loads.push(new LoadLocalDatabase());
    for (const load of this.loads) await load.init();
    this.loadDatabase();
  }

  public async reload(): Promise<void> {
    this.data = {};
    for (const load of this.loads) await load.init();
    this.loadDatabase();
  }

  private loadDatabase(): void {
    this.data = {};
    for (const load of this.loads) this.data = { ...this.data, ...load.data };
  }
}
