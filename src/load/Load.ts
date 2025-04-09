import { DatabaseType, ILoad } from "./ILoad";
import { LoadRemoteDatabase } from "./remote/LoadRemoteDatabase";

export class Load implements Omit<ILoad, "data"> {
  protected loads: ILoad[] = [];
  public async init(): Promise<void> {
    this.loads.push(new LoadRemoteDatabase());
    for (const load of this.loads) load.init();
  }

  public static async init(): Promise<void> {}
}
