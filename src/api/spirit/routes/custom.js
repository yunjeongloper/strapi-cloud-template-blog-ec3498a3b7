module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/spirits/findReadyToBottling",
      handler: "spirit.findReadyToBottling",
    },
  ],
};
