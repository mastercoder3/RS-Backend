import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

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

    app.enable('tust proxy');
    app.use(cors());
    app.use(bodyParser.json());


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