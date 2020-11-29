import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import LocationService from '../../services/location';
import { ILocationInput, ILocationSearchInput } from '../../interfaces/ILocation';

const route = Router();

export default (app: Router) =>{
    app.use('/locations', route);

    const locationServiceInstance = Container.get(LocationService);

    route.get('/all', middlewares.isAuth,  
        async(req: Request, res: Response, next: NextFunction) =>{
            const logger: any = Container.get('logger');
            try{
                const locations = await locationServiceInstance.getAllLocations();
                return res.json(locations).status(200);
            }
            catch(e){
                logger.error('🔥 error %o', e);
                return next(e);
            }
        }
    );

    route.post('/search', middlewares.isAuth,  
        celebrate({ 
            body:Joi.object({
                name: Joi.string().required()
            })
        }), 
        async(req: Request, res: Response, next: NextFunction) =>{
            const logger: any = Container.get('logger');
            try{
                const locations = await locationServiceInstance.searchLocation(req.body as ILocationSearchInput);
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
            type: Joi.string().required()
        })
    }), 
        async(req: Request, res: Response, next: NextFunction) =>{
            const logger: any = Container.get('logger');
            // logger.silly('Coming');
            try{
                const location = await locationServiceInstance.addLocation(req.body as ILocationInput);
                return res.json(location).status(200);
            }
            catch(e){
                logger.error('🔥 error %o', e);
                return next(e);
            }
        }
    )
}