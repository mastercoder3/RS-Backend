import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';
import config from '../config';

export default ({ app }: { app: express.Application }) => {

    /* 
    Test api's
    */

    app.get('/status', (req, res) => {
        res.status(200).json("Api Working").end();
    });

    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    // Setups for express

    app.enable('trust proxy');
    app.use(cors());
    app.use(bodyParser.json());
    app.use(require('method-override')());
    app.use(config.api.prefix, routes());

    // Hangling Errors
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        res.status(404);
        next(err);
    });

    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            return res
                .status(err.status)
                .send({ message: err.message })
                .end();
        }
        return next(err);
    });

}