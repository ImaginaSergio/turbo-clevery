const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = (on: any) => {
  // send in the options from your webpack.config.js, so it works the same
  // as your app's code

  const options = {
    webpackOptions: require('../../webpack.config'),
    watchOptions: {},
  };

  on('file:preprocessor', webpackPreprocessor(options));

  on('task', {
    setUserData: (userData: { email: string; password: string }) => {
      global.userData = userData;

      return null;
    },

    getUserData: () => {
      let data: { email: string; password: string } = { ...global.userData };

      return data;
    },

    setForoData: (foroData: { id: number; titulo: string; descripcion: string; tipo: string }) => {
      global.foroData = foroData;
      return null;
    },

    getForoData: () => {
      let data: { id: number; titulo: string; descripcion: string; tipo: string } = { ...global.foroData };

      return data;
    },
  });
};
