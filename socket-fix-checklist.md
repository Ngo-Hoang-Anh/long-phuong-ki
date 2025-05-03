# Socket Connection Fix Checklist

This checklist outlines the steps to fix the socket connection issue that was preventing users from joining games.

## Issue Description
- Users could login, logout, and view tables, but couldn't join games
- Socket.io endpoint was returning 404 Not Found: `https://long-phuong-backend-fragrant-silence-300.fly.dev/socket.io/?EIO=4&transport=polling&t=PQNEadU`
- The back-end was trying to run the socket server on a different port than the HTTP server

## Changes Made

### Back-end Changes
1. ✅ Updated `bootServer.ts` to use a single server for both HTTP and WebSocket
   - Modified `start()` method to use the HTTP server for both Express and Socket.io
   - Modified `startSocket()` method to use the same port as the HTTP server
   - Added better logging for debugging

2. ✅ Improved CORS configuration
   - Added more specific CORS options
   - Explicitly allowed necessary headers and methods

3. ✅ Added a health check endpoint
   - Added a root endpoint (`/`) that returns server status
   - Useful for debugging and monitoring

### Front-end Changes
1. ✅ Enhanced socket reconnection logic
   - Enabled automatic reconnection
   - Added proper handling of reconnection events
   - Added better error reporting
   - Improved user feedback during connection issues

## Deployment Steps

1. □ Deploy the back-end changes
   ```bash
   cd back-end
   flyctl deploy
   ```

2. □ Deploy the front-end changes
   ```bash
   cd front-end
   flyctl deploy
   ```

3. □ Verify the socket connection
   - Log in to the application
   - Open browser developer tools (F12)
   - Check the console for socket connection messages
   - Verify that you can join games

4. □ Monitor for any issues
   - Check server logs: `flyctl logs -a long-phuong-backend-fragrant-silence-300`
   - Watch for any socket-related errors

## Rollback Plan (if needed)
If issues persist after deployment:

1. □ Check the logs for specific errors
   ```bash
   flyctl logs -a long-phuong-backend-fragrant-silence-300
   ```

2. □ If necessary, roll back to the previous version
   ```bash
   # Get the previous image ID
   flyctl image show -a long-phuong-backend-fragrant-silence-300
   
   # Deploy the previous image
   flyctl deploy --image [previous-image-id] -a long-phuong-backend-fragrant-silence-300
   ```

## Additional Notes
- The socket server now runs on the same port as the HTTP server (5501)
- The front-end is configured to connect to `https://long-phuong-backend-fragrant-silence-300.fly.dev/`
- Socket.io automatically handles the path (`/socket.io`)
- The reconnection logic will attempt to reconnect up to 5 times with increasing delays
