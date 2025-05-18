module.exports = () => {
  const localeSubpaths = {};

  const publicRuntimeConfig = {
    localeSubpaths,
  };

  const pageExtensions = ['page.tsx', 'page.ts', 'page.jsx', 'page.js'];

  const env = {
    API_URL: process.env.API_URL,
    STORAGE_URL: process.env.STORAGE_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    TELEGRAM_BOT_ID: process.env.TELEGRAM_BOT_ID,
    TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME,
    EXCHANGE_RATE_KEY: process.env.EXCHANGE_RATE_KEY,
    STREAM_CHAT_API_KEY: process.env.STREAM_CHAT_API_KEY,
    STREAM_CHAT_API_SECRET: process.env.STREAM_CHAT_API_SECRET,
    SOCKET_WALLET_URL: process.env.SOCKET_WALLET_URL,
    SOCKET_GAME_URL: process.env.SOCKET_GAME_URL,
    project: process.env.NAME,
    projectId: process.env.WALLET_CONNECT_PROJECT,
    AUTHKEY: process.env.AUTH,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
  };

  const compiler = {
    removeConsole: process.env.NODE_ENV === 'production',
  };

  const webpack = (cfg, { isServer }) => {
    if (!isServer) {
      cfg.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            outputPath: 'static/fonts/',
            name: '[name].[ext]',
            esModule: false,
          },
        },
      });
    }
    const originalEntry = cfg.entry;
    // eslint-disable-next-line no-param-reassign
    cfg.entry = async () => {
      const entries = await originalEntry();
      if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
        entries['main.js'].unshift('./client/polyfills.js');
      }
      return entries;
    };

    cfg.module.rules.push({
      test: /\.(jpe?g|png|gif|svg|mp3)$/,
      loader: 'file-loader',
      options: {
        name: '[name]_[hash].[ext]',
        publicPath: `/_next/static/files`,
        outputPath: 'static/files',
      },
    });
    return cfg;
  };

  return {
    reactStrictMode: false,
    publicRuntimeConfig,
    webpack,
    env,
    pageExtensions,
    output: 'export',
    swcMinify: true,
    trailingSlash: true,
    images: {
      disableStaticImages: true,
      unoptimized: true,
    },
    optimizeFonts: false,
    compiler,
  };
};
