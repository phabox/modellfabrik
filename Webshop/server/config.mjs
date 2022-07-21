export default {
  /**
   * Description of all cylinders, that can be stacked in the product-configurator
   */
  cylinders: [
    {
      height: 15,
      colors: [
        {
          r: 0.85,
          g: 0.85,
          b: 0.85,
          name: "silber",
        },
        {
          r: 0.1,
          g: 0.1,
          b: 0.85,
          name: "blau",
        },
      ],
    },
    {
      height: 18,
      colors: [
        {
          r: 0.85,
          g: 0.85,
          b: 0.85,
          name: "silber",
        },
        {
          r: 0.1,
          g: 0.1,
          b: 0.85,
          name: "blau",
        },
      ],
    },
    {
      height: 22,
      colors: [
        {
          r: 0.85,
          g: 0.85,
          b: 0.85,
          name: "silber",
        },
        {
          r: 0.1,
          g: 0.1,
          b: 0.85,
          name: "blau",
        },
      ],
    },
  ],

  /**
   * Maximum height of stacked cylinders on one stack
   */
  maxHeight: 100,

  /**
   * Maximum number of cylinders that can be stacked on top of each other
   */
  maxCylinders: 4,
};
