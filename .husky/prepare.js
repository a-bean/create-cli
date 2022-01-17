const isCi = process.env.CI !== undefined;
if (!isCi) {
  /* eslint-disable @typescript-eslint/no-var-requires */
  // eslint-disable-next-line global-require
  require('husky').install();
}
