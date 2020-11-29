import { Router } from 'express';
import auth from './routes/auth';
import location from './routes/location';
import favorite from './routes/favorite';

// for dependencies
export default () => {
	const app = Router();
	auth(app);
	location(app);
	favorite(app);
	return app
}