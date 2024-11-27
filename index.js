// index.js
'use strict'

const PushNotificationService = require('./dist/services/push-notification').default
const OrderPlacedSubscriber = require('./dist/subscribers/order-placed').default

const CustomerDevice = require('./dist/models/customer-device').CustomerDevice
const DeviceSubscription = require('./dist/models/device-subscription').DeviceSubscription


module.exports = (container, options) => {
  try {
    // Register model
    container.registerAdd('models', [CustomerDevice, DeviceSubscription])

    // Register service
    container.registerAdd('pushNotificationService',  asClass(PushNotificationService))

    return {
      migrations: [
        require('./dist/migrations/1730792039608-CreatePushSubscriptionTable').CreatePushSubscriptionTables730792039608
      ],
      subscribers: [RestockSubscriber],
      services: [PushNotificationService],
      models: [CustomerDevice, DeviceSubscription],
    }
  } catch (error) {
    console.error("Error loading restock notification plugin:", error)
    throw error
  }
}