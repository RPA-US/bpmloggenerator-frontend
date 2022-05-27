import configuration from "infrastructure/util/configuration";
import { Experiment, ExperimentState } from "./types";

type QueuedChecker = {
  id: number;
  checkFunction: Function;
  updaterFunction?: Function;
  nCalls: number;
}

export default class ExperimentStatusChecker {

  private queue: QueuedChecker[];

  constructor(private retrievalByIdFn: Function) {
    this.queue = [];
  }

  checkExperimentStatus(experiment: Experiment, updater: Function, authToken: string, onFinish?: Function) {
    if (experiment.state === ExperimentState.CREATING) {
      let queuedChecker = this.queue.find(checker => checker.id === experiment.id);
      if (queuedChecker == null) {
        const retrievalByIdFn = this.retrievalByIdFn.bind(this, experiment.id, authToken);
        const { queue } = this; 
        queuedChecker = {
          id: experiment.id,
          nCalls: 0,
          checkFunction: function () {
            const checkStatus = (cb: Function) => {
              this.nCalls ++;
              const delay = Math.ceil(this.nCalls / 4);
              setTimeout(async () => {
                const newData = await retrievalByIdFn();
                if (this.updaterFunction != null) {
                  this.updaterFunction(newData);
                }
                if (newData.state === ExperimentState.CREATING) {
                  cb(cb);
                } else {
                  const index = queue.findIndex(item => item.id === newData.id);
                  if (index !== -1) queue.splice(index, 1);
                  onFinish != null && onFinish(newData);
                }
              }, configuration.CREATING_EXPERIMENT_RELOAD_TIME * delay);
            };

            checkStatus(checkStatus);
          }
        } as QueuedChecker;
        queuedChecker.checkFunction();
        queue.push(queuedChecker);
      }
      queuedChecker.updaterFunction = updater;
    }
  }

}