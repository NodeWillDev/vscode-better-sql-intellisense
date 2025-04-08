import { DatabaseType, ILoad } from "./ILoad";
import { LoadLocalDatabase } from "./local/LoadLocalDatabase";
import { LoadRemoteDatabase } from "./remote/LoadRemoteDatabase";

export class Load implements Omit<ILoad, "data"> {
  protected loads: ILoad[] = [];
  public async init(): Promise<void> {
    this.loads.push(new LoadRemoteDatabase());
    this.loads.push(new LoadLocalDatabase());
    for (const load of this.loads) load.init();
  }
}
