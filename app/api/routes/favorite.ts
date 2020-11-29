import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import FavoriteService from '../../services/favorite';
import { IFavorite, IFavoriteExistInput, IFavoriteUserInput } from '../../interfaces/IFavorite';
import mongoose from 'mongoose';

const route = Router();

export default (app: Router) =>{
    app.use('/favorites', route);

    const favoriteServiceInstance = Container.get(FavoriteService);

    route.post('/all', middlewares.isAuth,
    celebrate({ 
        body:Joi.object({
            userId: Joi.string().required()
        })
    }),   
        async(req: Request, res: Response, next: NextFunction) =>{
            const logger: any = Container.get('logger');
            try{
                const locations = await favoriteServiceInstance.getAllUserFavorites(req.body as IFavoriteUserInput);
                return res.json(locations).status(200);
            }
            catch(e){
                logger.error('🔥 error %o', e);
                return next(e);
            }
        }
    );

    route.post('/add', middlewares.isAuth,
    celebrate({ 
        body:Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required(),
            phone: Joi.string().required(),
            type: Joi.string().required(),
            userId: Joi.string().required(),
            locationId: Joi.string().required(),
        })
    }), 
        async(req: Request, res: Response, next: NextFunction) =>{
            const logger: any = Container.get('logger');
            // logger.silly('Coming');
            try{
                const location = await favoriteServiceInstance.addFavorite(req.body as IFavorite);
                return res.json(location).status(200);
            }
            catch(e){
                logger.error('🔥 error %o', e);
                return next(e);
            }
        }
    );

    route.post('/checkFavorite', middlewares.isAuth,
    celebrate({ 
        body:Joi.object({
            userId: Joi.string().required(),
            locationId: Joi.string().required(),
        })
    }), 
        async(req: Request, res: Response, next: NextFunction) =>{
            const logger: any = Container.get('logger');
            // logger.silly('Coming');
            try{
                const location = await favoriteServiceInstance.checkIfExists(req.body as IFavoriteExistInput);
                return res.json(location).status(200);
            }
            catch(e){
                logger.error('🔥 error %o', e);
                return next(e);
            }
        }
    );

    route.post('/deleteFavorite', middlewares.isAuth,
    celebrate({ 
        body:Joi.object({
            id: Joi.string().required(),
        })
    }), 
        async(req: Request, res: Response, next: NextFunction) =>{
            const logger: any = Container.get('logger');
            // logger.silly('Coming');
            try{
                const {  success } = await favoriteServiceInstance.deleteFavorite(req.body.id as mongoose.Schema.Types.ObjectId);
                return res.status(201).json({ success});
            }
            catch(e){
                logger.error('🔥 error %o', e);
                return next(e);
            }
        }
    )

}