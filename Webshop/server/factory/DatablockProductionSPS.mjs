//name of the datablock in the SPS
const DATABLOCK = "DB10000";
const SEPARATOR = ",";
const BYTE = "BYTE";

/**
 * the variables in the SPS that are being read by this programm
 * the strings contain the datatype of the variable and offset in the DATABLOCK. encoded according to {@see https://github.com/plcpeople/nodeS7}
 */

var offset = 0;
const DB_VARIABLES_PRODUCTION = {
  orderID: DATABLOCK + SEPARATOR + "INT" + offset,
  orderCompleted: DATABLOCK + SEPARATOR + BYTE + (offset += 2),
  timeOrderCompleted: DATABLOCK + SEPARATOR + "DTL" + offset,
  orderName: DATABLOCK + SEPARATOR + "S" + (offset += 12) + ".64",

  //height values for tower A
  heightA1: DATABLOCK + SEPARATOR + BYTE + (offset += 66), //Check offset
  heightA2: DATABLOCK + SEPARATOR + BYTE + ++offset,
  heightA3: DATABLOCK + SEPARATOR + BYTE + ++offset,
  heightA4: DATABLOCK + SEPARATOR + BYTE + ++offset,
  heightA5: DATABLOCK + SEPARATOR + BYTE + ++offset,

  //height values for tower B
  heightB1: DATABLOCK + SEPARATOR + BYTE + ++offset,
  heightB2: DATABLOCK + SEPARATOR + BYTE + ++offset,
  heightB3: DATABLOCK + SEPARATOR + BYTE + ++offset,
  heightB4: DATABLOCK + SEPARATOR + BYTE + ++offset,
  heightB5: DATABLOCK + SEPARATOR + BYTE + ++offset,

  //cylinders present in the production station
  productionStock15mmSilver: DATABLOCK + SEPARATOR + BYTE + ++offset,
  productionStock15mmBlue: DATABLOCK + SEPARATOR + BYTE + ++offset,
  productionStock18mmSilver: DATABLOCK + SEPARATOR + BYTE + ++offset,
  productionStock18mmBlue: DATABLOCK + SEPARATOR + BYTE + ++offset,
  productionStock22mmSilver: DATABLOCK + SEPARATOR + BYTE + ++offset,
  productionStock22mmBlue: DATABLOCK + SEPARATOR + BYTE + ++offset,
};

const READ_VARIABLES_PRODUCTION = [
  "orderCompleted",
  "productionStock15mmSilver",
  "productionStock15mmBlue",
  "productionStock18mmSilver",
  "productionStock18mmBlue",
  "productionStock22mmSilver",
  "productionStock22mmBlue",
];

const WRITE_VARIABLES_PRODUCTION = [
  "orderID",
  "orderCompleted",
  "orderName",
  "heightA1",
  "heightA2",
  "heightA3",
  "heightA4",
  "heightA5",
  "heightB1",
  "heightB2",
  "heightB3",
  "heightB4",
  "heightB5",
];

export {
  DB_VARIABLES_PRODUCTION,
  READ_VARIABLES_PRODUCTION,
  WRITE_VARIABLES_PRODUCTION,
};
