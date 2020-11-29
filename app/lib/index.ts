import expressLoader from './express';
import Logger from './logger';
import mongooseLoader from './mongoose';
import injector from './injector'


export default async ({expressApp}) =>{

    const mongoConnection =await mongooseLoader();
    console.log('coming');

    const userModel = {
        name: 'userModel',
        model: require('../models/user').default,
    };

    const locationModel = {
        name: 'locationModel',
        model: require('../models/location').default,
    };

    const favoriteModel = {
      name: 'favoriteModel',
      model: require('../models/favorite').default,
    };

      const { agenda } = await injector({
        mongoConnection,
        models: [
          userModel,
          locationModel,
          favoriteModel
        ]
      });

    // (async () =>{
    //     const user = [{name: 'test name', email: 'test@gmail.com', password: '123123'}];
    //     try {
    //         for (const user of users) {
    //           await Models.UserModel.create(user);
    //           console.log(`Created user ${user.firstName} ${user.lastName}`);
    //         }
    //         disconnect();
    //       } catch (e) {
    //         console.error(e);
    //       }
    // })();


    await expressLoader({ app: expressApp });
    Logger.info('Express ready to go!!');
}