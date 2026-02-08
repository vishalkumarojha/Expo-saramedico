# 🚀 Quick Reference: API Configuration

## Switch Between APIs

### Use AWS API (Default) ✅
```bash
# In .env file
API_ENVIRONMENT=aws
```

### Use Local API 💻
```bash
# In .env file
API_ENVIRONMENT=local
LOCAL_API_PORT=8000
```

## After Changing .env

**Always restart the app:**
```bash
# Stop current server (Ctrl+C)
npm start
```

## Check Active API

Look for console logs when app starts:
```
🌐 [API Config] Using AWS Deployed API
✅ [API Config] Base URL: http://65.0.98.170:8000/api/v1
```

## API Endpoints

- **AWS API Docs**: http://65.0.98.170:8000/docs
- **Local API Docs**: http://localhost:8000/docs

## Need Help?

See [API_CONFIGURATION.md](file:///home/arno/Desktop/Projects/folder/sara_medico/react/API_CONFIGURATION.md) for detailed instructions.
