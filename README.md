# Medusa Push Notifications Plugin

A plugin for Medusa e-commerce that adds push notification functionality. This plugin allows you to manage device registrations and send push notifications to customers across multiple devices.

## Features

- 🔔 Push notification support for web browsers
- 📱 Multi-device support per customer
- 🔄 Automatic device registration and management
- 🔐 Secure VAPID-based implementation
- 🛠️ Admin API for sending notifications
- 🔌 Event-based notification triggers

## Prerequisites

- Medusa backend
- Redis (for event bus)
- PostgreSQL
- VAPID Keys (for push notifications)

## Installation

```bash
npm install @intuio/medusa-push-notification@medusa-v1
```

## Configuration

Add to your `medusa-config.js`:

```javascript
const plugins = [
  // ... other plugins
  {
    resolve: `@intuio/medusa-push-notification`,
  }
]
```

### Environment Variables

```bash
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:your@email.com
```

### Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

## API Routes

### Store API

```bash
# Register device
POST /store/push-notifications
{
    "subscription": {
        "endpoint": "https://push-service.example.com/...",
        "keys": {
            "p256dh": "base64-encoded-key",
            "auth": "base64-encoded-auth"
        }
    },
    "device_info": {
        "type": "mobile",
        "browser": "Chrome",
        "os": "Android",
        "model": "Samsung S21"
    }
}

# Unregister device
DELETE /store/push-notifications/{device_id}
```

### Admin API

```bash
# Send notification to customers
POST /admin/push-notifications
{ 
    "customer_ids": ["cust_123", "cust_456"],
    "notification": {
        "title": "Special Offer!",
        "body": "Check out our new products",
        "icon": "/icon.png",
        "data": {
            "url": "/products/new"
        }
    }
}
```

## Service Methods

```typescript
// Get service instance
const pushService = container.resolve("push")

// Register a device
await pushService.registerDevice({
    customer_id: "cust_123",
    device_info: {
        type: "mobile",
        browser: "Chrome",
        os: "Android",
        model: "Pixel 6"
    },
    subscription: {
        endpoint: "...",
        keys: {
            p256dh: "...",
            auth: "..."
        }
    }
})

// Send notification
await pushService.sendNotification(
    ["cust_123"],
    {
        title: "Hello",
        body: "This is a test notification",
        data: { url: "/orders/123" }
    }
)
```

## Frontend Implementation

1. Register Service Worker:

```javascript
// public/sw.js
self.addEventListener('push', function(event) {
    if (!event.data) return
    
    const data = event.data.json()
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            badge: data.badge,
            data: data.data,
        })
    )
})

self.addEventListener('notificationclick', function(event) {
    event.notification.close()
    
    if (event.notification.data?.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        )
    }
})
```

2. Example React Component: 

```jsx
import { useNotification } from './hooks/useNotification'

function NotificationButton() {
    const { 
        permission,
        isLoading,
        error,
        enableNotifications 
    } = useNotification()

    return (
        
            {permission === 'default' && (
                
                    Enable Push Notifications
                
            )}
            {/* ... other status displays */}
        
    )
}
```


## Events

The plugin listens to the following events by default:
- `order.placed`
- `order.canceled`
- `order.items_returned`
- `order.shipment_created`
- `return.requested`

## Development

```bash
# Clone the repository
git clone your-repo-url
cd medusa-push-notifications

# Install dependencies
npm install

# Build
npm run build

# Watch mode
npx medusa develop
```

## 💬 Let's Connect
We’re building this in public at Intuio Software Labs — a premium product studio focused on ecommerce and open-source innovation.
☕ Like the plugin? Buy us a coffee or support our efforts : [Donate here](https://buymeacoffee.com/intuio)

### 👥 Collaborate With Us
We’re looking for contributors, collaborators, and ecommerce founders to partner with. If you’re doing something cool with Medusa or want to build the next big thing, reach out!

📩 info@intuio.io / sales@intuio.io

🌐 https://intuio.io

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Check out the contributing guide to get started.

## 📜 License
MIT © Intuio Software Labs

## 📈 Loved By the Community?
If you’ve used this plugin and found it helpful, leave us a ⭐ on GitHub and share it with others using Medusa.
