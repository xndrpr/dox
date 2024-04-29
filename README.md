# Dox

Dox is a automation system for telegram(3rd on my github..);

Similar project in rust: https://github.com/velaton618/quantum

## Get started
To get started you need an API_ID and API_HASH from https://core.telegram.org/api/obtaining_api_id

### .env
Create .env file and fill it this way:

```env
API_ID="YOUR_API_ID"
API_HASH="YOUR_API_HASH"
SESSION=
```

### config.json
Create config.json file and fill it. 

Example:

```json
{
    "target": "@ElonMusk", // or ID,
    "messages": [
        {
            "text": ".next",
            "wait_message": { // DOX will wait **forever** until this message is received. Unless use set a timeout option
                "target": "Hi",
                "reply": "Hello",
                "wait_message": {
                    "target": "How are you?",
                    "reply": "I'm fine, thank you. How are you?",
                    "wait_message": {
                        "target": "I'm fine too",
                        "reply": "That's great to hear. How can I help you today?"
                    }
                }
            },
            "delay": 1, // In seconds
            // "timeout": 1 // In seconds
        }
    ]
}
```