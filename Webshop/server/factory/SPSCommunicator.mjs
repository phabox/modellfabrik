import nodes7 from "nodes7";

export default class SPSCommunicator {
  //enable mocking of connection in unit tests
  constructor(
    ip,
    dbVariables,
    readVariables,
    conn = new nodes7({ silent: true })
  ) {
    this.ip = ip;
    this.dbVariables = dbVariables;
    this.readVariables = readVariables;
    this.conn = conn;
    this.isConnected = false;

    this.conn.initiateConnection(
      { port: 102, host: ip, rack: 0, slot: 1 },
      () => {
        this.connectedCallback();
      }
    );
  }

  /**
   * Gets called after the connection to the sps was established.
   * @param err Error in case the connection could not be established
   */
  connectedCallback(err) {
    if (typeof err !== "undefined") {
      console.log(
        "ERROR: Connection to SPS " +
          this.ip +
          "failed. Further communication with this SPS will be skipped."
      );
      return;
    }

    this.conn.setTranslationCB((tag) => {
      return this.dbVariables[tag];
    });
    this.conn.addItems(this.readVariables);
    this.isConnected = true;
  }

  /**
   * Reads all values from the sps.
   * @returns {Object} - A Promise containing all values
   */
  readAllItems() {
    if (!this.isConnected) {
      return;
    }

    return new Promise((accept, reject) => {
      this.conn.readAllItems((anythingBad, values) => {
        if (anythingBad) {
          reject(
            new Error("Something went wrong reading values from SPS " + this.ip)
          );
        }
        accept(values);
      });
    });
  }

  /**
   * Writes multiple keys and objects into the sps. Number of keys must match the number of values.
   * @param keys The keys to be written
   * @param values The corresponding values
   */
  writeItems(keys, values) {
    if (!this.isConnected) {
      return;
    }

    this.conn.writeItems(keys, values, (anythingBad) => {
      if (anythingBad) {
        console.log("Something went wrong writing values to SPS" + this.ip);
      }
    });
  }
}
