module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: "ko",
    locales: ["en", "ko"],
    pages: {
      "*": ["common"],
      "/": ["index"],
      "/paymens": ["payments"],
      "/dashboard": ["dashboard"]
    }
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
