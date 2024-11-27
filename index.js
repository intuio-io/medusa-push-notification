// index.js
'use strict'

const PushNotificationService = require('./dist/services/push-notification').default

const ItemsReturnedSubscriber = require('./dist/subscribers/items-returned').default
const OrderCanceledSubscriber = require('./dist/subscribers/order-canceled').default
const OrderPlacedSubscriber = require('./dist/subscribers/order-placed').default
const OrderShipmentSubscriber = require('./dist/subscribers/order-shipment-created').default
const ReturnRequestedSubscriber = require('./dist/subscribers/return-requested').default


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
      subscribers: [OrderPlacedSubscriber, OrderCanceledSubscriber, ItemsReturnedSubscriber, OrderShipmentSubscriber, ReturnRequestedSubscriber],
      services: [PushNotificationService],
      models: [CustomerDevice, DeviceSubscription],
    }
  } catch (error) {
    console.error("Error loading restock notification plugin:", error)
    throw error
  }
}