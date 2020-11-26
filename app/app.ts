import 'reflect-metadata';
import express from 'express';
import config from './config/index';
import Logger from './lib/logger';

async function startServer(){
    const app = express();
    await require('./lib').default({ expressApp: app });
    app.listen(config.port, () => {
        Logger.info(`
          ################################################
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                 Server listening on port: ${config.port}
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          ################################################
        `);
      });
}

startServer();