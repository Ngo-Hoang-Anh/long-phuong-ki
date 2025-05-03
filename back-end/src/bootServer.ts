import express from 'express';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { HttpError } from 'http-errors';
import { Shared } from './common/utility/shared';
import apiRouter from './routes';
import http, { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import { setupSocketIo } from './sockets';
import cors from 'cors';
import morganMiddleware from 'middlewares/morgan';
import socketAuth from 'middlewares/socket_middlewares/Authentication';



const normalizePort = (val: any) => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port > 0) {
        return port;
    }
    return false;
}
export class BootServer {
    public app: express.Application;
    public server: Server;
    public io: SocketServer;
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app)
        this.io = new SocketServer(this.server, {
            cors: {
                origin: "*", methods: ["GET", "POST"],
            }
        });
        this.setup();
    }
    start = () => {
        const port = normalizePort(process.env.PORT || 9001);
        console.log(`Attempting to start server on port ${port} (PORT env: ${process.env.PORT || 'not set'})`);
        // Use the HTTP server for both Express and Socket.io
        this.server.listen(port, '0.0.0.0', () => {
            console.log(`Express and Socket.io server has started on port ${port}. Listening on all network interfaces (0.0.0.0)`);
        });
    }
    // This method is used by socket.ts and should now use the same server
    startSocket = () => {
        const port = normalizePort(process.env.PORT || 9001);
        console.log(`Starting socket server on port ${port}`);
        // Use the same port for socket.io
        this.server.listen(port, '0.0.0.0', () => {
            console.log(`Socket.io server has started on port ${port}. Listening on all network interfaces (0.0.0.0)`);
        });
    }
    setupSocket = () => {
        this.io.use(socketAuth);
        setupSocketIo(this.io);
    }
    setup = () => {
        // Configure CORS with more specific options
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(morganMiddleware);
        this.app.use(cookieParser());

        // Configure Socket.io
        this.io.use(socketAuth);
        setupSocketIo(this.io);

        // Add a health check endpoint for Fly.io
        this.app.get('/', (req, res) => {
            res.status(200).json({
                status: 'ok',
                message: 'Server is running',
                port: process.env.PORT || 'default'
            });
        });

        // API routes
        this.app.use('/api', apiRouter);
    }
    configHeader = (req: Request, res: Response, next: NextFunction) => {
        //Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        //Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        // res.setHeader('Content-Type','application/json');

        //Request headers you wish to allow
        res.setHeader('Access - Control - Allow - Method', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Pass to next layer of middleware
        next();
    }
    handleError = (err: HttpError | Error | string, req: Request, res: Response, next: NextFunction) => {
        let errConfig = Shared.createError();
        if (err instanceof HttpError) {
            errConfig = err
        } else {
            if (err instanceof Error) {
                if (err.name === 'EntityMetadataNotFound' || err.name === 'ECONNREFUSED') {
                    err.message = 'NOT FOUND CONNECT DATABASE';
                } else {
                    errConfig.message = err.message;
                    errConfig.statusCode = 500
                }
            } else {
                if (typeof (err) === 'string') {
                    errConfig.message = err
                    errConfig.statusCode = 404
                }
            }
        }
        console.log('==========');
        console.log(errConfig);
    }
}