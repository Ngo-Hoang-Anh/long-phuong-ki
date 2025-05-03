# Deploying to Fly.io (Version 3)

This guide will help you deploy version 3 of your application to Fly.io, updating the existing deployment.

## Prerequisites

1. Make sure you have the Fly.io CLI installed and are logged in
2. Ensure your MongoDB Atlas database is properly configured

## Steps to Deploy

### 1. Verify MongoDB Connection String

First, check if you need to update your MongoDB connection string:

```bash
fly secrets list -a long-phuong-backend-fragrant-silence-300
```

If you need to update it:

```bash
fly secrets set DATABASE_URL="mongodb+srv://username:password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority" -a long-phuong-backend-fragrant-silence-300
```

### 2. Check Your Fly.io IP Address

To verify your Fly.io application's IP in MongoDB Atlas:

```bash
fly ips list -a long-phuong-backend-fragrant-silence-300
```

If the IP has changed, add the new IPv4 address to your MongoDB Atlas IP whitelist.

### 3. Deploy Your Application

Deploy your application with the changes in v3:

```bash
flyctl deploy
```

### 4. Check the Logs

After deployment, check the logs to see if your application is running correctly:

```bash
fly logs -a long-phuong-backend-fragrant-silence-300
```

Look for messages indicating that the server has started successfully on port 5501.

### 5. Open Your Application

Open your application in a browser:

```bash
fly open -a long-phuong-backend-fragrant-silence-300
```

## Troubleshooting

If you're experiencing issues:

1. **Check MongoDB Connection**: Make sure your MongoDB Atlas IP whitelist includes the Fly.io IP addresses.

2. **Check Environment Variables**: Verify that the PORT environment variable is set to 5501 in both your Dockerfile and fly.toml.

3. **Check Logs**: Look for any error messages in the logs that might indicate what's going wrong.

4. **Restart the Application**: Sometimes a simple restart can fix issues:

```bash
fly apps restart -a long-phuong-backend-fragrant-silence-300
```

5. **Scale to Zero and Back**: If the application is stuck, try scaling to zero and back:

```bash
fly scale count 0 -a long-phuong-backend-fragrant-silence-300
fly scale count 1 -a long-phuong-backend-fragrant-silence-300
```

## Rolling Back

If you need to roll back to the previous version:

1. Get the previous image ID:

```bash
fly image show -a long-phuong-backend-fragrant-silence-300
```

2. Deploy the previous image:

```bash
fly deploy --image [previous-image-id] -a long-phuong-backend-fragrant-silence-300
```

This should help ensure that your application listens on the correct port and provides better debugging information.
