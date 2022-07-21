export default class Stock {
  constructor(
    immediateStock15mmSilver = 0,
    immediateStock15mmBlue = 0,
    immediateStock18mmSilver = 0,
    immediateStock18mmBlue = 0,
    immediateStock22mmSilver = 0,
    immediateStock22mmBlue = 0,
    intermediateStock15mmSilver = 0,
    intermediateStock15mmBlue = 0,
    intermediateStock18mmSilver = 0,
    intermediateStock18mmBlue = 0,
    intermediateStock22mmSilver = 0,
    intermediateStock22mmBlue = 0
  ) {
    this.immediateStock15mmSilver = immediateStock15mmSilver;
    this.immediateStock15mmBlue = immediateStock15mmBlue;
    this.immediateStock18mmSilver = immediateStock18mmSilver;
    this.immediateStock18mmBlue = immediateStock18mmBlue;
    this.immediateStock22mmSilver = immediateStock22mmSilver;
    this.immediateStock22mmBlue = immediateStock22mmBlue;

    this.intermediateStock15mmSilver = intermediateStock15mmSilver;
    this.intermediateStock15mmBlue = intermediateStock15mmBlue;
    this.intermediateStock18mmSilver = intermediateStock18mmSilver;
    this.intermediateStock18mmBlue = intermediateStock18mmBlue;
    this.intermediateStock22mmSilver = intermediateStock22mmSilver;
    this.intermediateStock22mmBlue = intermediateStock22mmBlue;
  }

  static fromDictionary(d) {
    return new Stock(
      d.productionStock15mmSilver,
      d.productionStock15mmBlue,
      d.productionStock18mmSilver,
      d.productionStock18mmBlue,
      d.productionStock22mmSilver,
      d.productionStock22mmBlue,
      d.storageStock15mmSilver,
      d.storageStock15mmBlue,
      d.storageStock18mmSilver,
      d.storageStock18mmBlue,
      d.storageStock22mmSilver,
      d.storageStock22mmBlue
    );
  }

/**
 * Checks if a material is present in the stock
 * @param material The necessary material 
 * @returns  return true if this stock contains all or more of the specified materials
 */
  containsMaterial(material) {
    for (const [key, value] of Object.entries(material)) {
      switch (key) {
        case "15mmSilver":
          if (
            this.intermediateStock15mmSilver + this.immediateStock15mmSilver <
            value
          )
            return false;
          break;
        case "15mmBlue":
          if (
            this.intermediateStock15mmBlue + this.immediateStock15mmBlue <
            value
          )
            return false;
          break;
        case "18mmSilver":
          if (
            this.intermediateStock18mmSilver + this.immediateStock18mmSilver <
            value
          )
            return false;
          break;
        case "18mmBlue":
          if (
            this.intermediateStock18mmBlue + this.immediateStock18mmBlue <
            value
          )
            return false;
          break;
        case "22mmSilver":
          if (
            this.intermediateStock22mmSilver + this.immediateStock22mmSilver <
            value
          )
            return false;
          break;
        case "22mmBlue":
          if (
            this.intermediateStock22mmBlue + this.immediateStock22mmBlue <
            value
          )
            return false;
          break;
        default:
          throw "Unknown cylinder name";
      }
    }
    return true;
  }

  /**
   * Transforms the stock for the GraphQL api
   * @returns {Object} - Object containing the stock in a suitable format for the GraphQL api
   */
  transformStock() {
    return {
      immediateStock: [
        {
          height: 15,
          color: "silber",
          available: this.immediateStock15mmSilver,
        },
        {
          height: 15,
          color: "blau",
          available: this.immediateStock15mmBlue,
        },
        {
          height: 18,
          color: "silber",
          available: this.immediateStock18mmSilver,
        },
        {
          height: 18,
          color: "blau",
          available: this.immediateStock18mmBlue,
        },
        {
          height: 22,
          color: "silber",
          available: this.immediateStock22mmSilver,
        },
        {
          height: 22,
          color: "blau",
          available: this.immediateStock22mmBlue,
        },
      ],
      intermediateStock: [
        {
          height: 15,
          color: "silber",
          available: this.intermediateStock15mmSilver,
        },
        {
          height: 15,
          color: "blau",
          available: this.intermediateStock15mmBlue,
        },
        {
          height: 18,
          color: "silber",
          available: this.intermediateStock18mmSilver,
        },
        {
          height: 18,
          color: "blau",
          available: this.intermediateStock18mmBlue,
        },
        {
          height: 22,
          color: "silber",
          available: this.intermediateStock22mmSilver,
        },
        {
          height: 22,
          color: "blau",
          available: this.intermediateStock22mmBlue,
        },
      ],
    };
  }
}
