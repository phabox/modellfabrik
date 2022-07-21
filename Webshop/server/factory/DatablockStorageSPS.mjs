//name of the datablock in the SPS
const DATABLOCK = "DB10000";
const SEPARATOR = ",";
const BYTE = "BYTE";

var offset = 0;
const DB_VARIABLES_STORAGE = {
  //cylinders present in the storage station
  storageStock15mmSilver: DATABLOCK + SEPARATOR + BYTE + offset,
  storageStock15mmBlue: DATABLOCK + SEPARATOR + BYTE + ++offset,
  storageStock18mmSilver: DATABLOCK + SEPARATOR + BYTE + ++offset,
  storageStock18mmBlue: DATABLOCK + SEPARATOR + BYTE + ++offset,
  storageStock22mmSilver: DATABLOCK + SEPARATOR + BYTE + ++offset,
  storageStock22mmBlue: DATABLOCK + SEPARATOR + BYTE + ++offset,
};

const READ_VARIABLES_STORAGE = [
  "storageStock15mmSilver",
  "storageStock15mmBlue",
  "storageStock18mmSilver",
  "storageStock18mmBlue",
  "storageStock22mmSilver",
  "storageStock22mmBlue",
];

export { DB_VARIABLES_STORAGE, READ_VARIABLES_STORAGE };
