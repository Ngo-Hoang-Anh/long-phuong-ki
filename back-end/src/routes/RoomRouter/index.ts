
import { getWaitingRoomController, postCreateRoomController, getPlayingRoomController, getDetailRoomController } from 'controllers/RoomController';
import { Router } from 'express';
const roomRouter: Router = Router();



roomRouter.post('/create', postCreateRoomController);
roomRouter.get('/getWaiting', getWaitingRoomController);
roomRouter.get('/getPlaying', getPlayingRoomController);
roomRouter.get('/:roomId', getDetailRoomController);


export default roomRouter