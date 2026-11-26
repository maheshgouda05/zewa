/**
 * ZEWA E2E Automated Integration Test Suite
 * Tests all 3 user roles, dynamic pricing, 2-unit limit, payment verification,
 * kitchen preparation, and delivery routing end-to-end.
 */

const http = require('http');
const app = require('./backend/server');

let PORT = 0;
let server;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api${path}`,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = { raw: data };
        }
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 ZEWA FOOD SURPLUS MARKETPLACE - E2E TEST SUITE');
  console.log('======================================================\n');

  let customerToken = null;
  let restaurantToken = null;
  let deliveryToken = null;
  let foodItem = null;
  let reservationId = null;
  let orderId = null;
  let assignmentId = null;

  // 1. Health Check
  console.log('▶ [1/8] Verifying Health Check...');
  const health = await request('/health');
  assert(health.status === 200 && health.data.status === 'healthy', 'Health endpoint returns 200 OK');

  // 2. Multi-Role Authentication
  console.log('\n▶ [2/8] Testing Multi-Role Authentication...');
  const custAuth = await request('/auth/login', {
    method: 'POST',
    body: { email: 'customer@zewa.demo', password: 'demo_password_123' }
  });
  assert(custAuth.status === 200 && custAuth.data.session.token, 'Customer login succeeded');
  customerToken = custAuth.data.session.token;

  const restAuth = await request('/auth/login', {
    method: 'POST',
    body: { email: 'restaurant@zewa.demo', password: 'demo_password_123' }
  });
  assert(restAuth.status === 200 && restAuth.data.user.role === 'restaurant', 'Restaurant login succeeded');
  restaurantToken = restAuth.data.session.token;

  const delAuth = await request('/auth/login', {
    method: 'POST',
    body: { email: 'delivery@zewa.demo', password: 'demo_password_123' }
  });
  assert(delAuth.status === 200 && delAuth.data.user.role === 'delivery_partner', 'Delivery partner login succeeded');
  deliveryToken = delAuth.data.session.token;

  // 3. Customer Food Feed & Dynamic Pricing
  console.log('\n▶ [3/8] Testing Customer Surplus Feed & Dynamic Pricing...');
  const feed = await request('/customer/feed?lat=12.9784&lng=77.6408');
  assert(feed.status === 200 && Array.isArray(feed.data.items), 'Customer feed returned items array');
  assert(feed.data.items.length > 0, `Surplus feed contains ${feed.data.items.length} items`);
  foodItem = feed.data.items[0];
  assert(foodItem.pricing.current_price <= foodItem.starting_price, 'Dynamic price is at or below starting price');
  assert(foodItem.pricing.current_price >= foodItem.min_price, 'Dynamic price honors minimum floor price');
  assert(foodItem.pricing.discount_percentage >= 30, `Dynamic discount is active (${foodItem.pricing.discount_percentage}%)`);

  // 4. Strict Purchase Limit (Max 2 units)
  console.log('\n▶ [4/8] Testing Anti-Hoarding Fair Share Rule (Max 2 units)...');
  const greedyReserve = await request('/customer/reserve', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: { food_item_id: foodItem.id, quantity: 3 }
  });
  assert(greedyReserve.status === 400, 'Attempting to reserve 3 units was rejected with 400 Bad Request');
  assert(greedyReserve.data.error.includes('Maximum 2 units'), 'Error message specifically cites 2-unit limit');

  // Valid 2-unit reservation
  const validReserve = await request('/customer/reserve', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: { food_item_id: foodItem.id, quantity: 2 }
  });
  assert(validReserve.status === 201 && validReserve.data.reservation.id, 'Reserving 2 units succeeded with 10-minute hold');
  reservationId = validReserve.data.reservation.id;

  // Additional reservation while held should fail
  const overReserve = await request('/customer/reserve', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: { food_item_id: foodItem.id, quantity: 1 }
  });
  assert(overReserve.status === 400, 'Exceeding 2 units while holding previous reservation was blocked');

  // 5. Payment Session & Server-Side Payment Verification
  console.log('\n▶ [5/8] Testing Prepaid Session & Server-Side Verification...');
  const paySession = await request('/orders/create-payment-session', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: { reservation_id: reservationId }
  });
  assert(paySession.status === 200 && paySession.data.payment_id, 'Payment session created');

  const verifyPay = await request('/orders/verify-payment', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      payment_id: paySession.data.payment_id,
      payment_signature: paySession.data.mock_signature,
      gateway_order_id: paySession.data.gateway_order_id,
      delivery_address: '100 Feet Rd, Indiranagar, Bengaluru 560038',
      delivery_notes: 'Leave at reception'
    }
  });
  assert(verifyPay.status === 201 && verifyPay.data.order.order_number, 'Server verified payment and generated order');
  assert(verifyPay.data.order.order_number.startsWith('ZW-'), `Order ID format valid: ${verifyPay.data.order.order_number}`);
  orderId = verifyPay.data.order.id;

  // 6. Restaurant Order Processing
  console.log('\n▶ [6/8] Testing Restaurant Kitchen Workflow...');
  const restDash = await request('/restaurant/dashboard', {
    headers: { Authorization: `Bearer ${restaurantToken}` }
  });
  assert(restDash.status === 200, 'Restaurant dashboard loaded');
  const foundOrder = restDash.data.orders.find(o => o.id === orderId);
  assert(foundOrder !== undefined, 'New paid order appears in restaurant incoming queue');

  const prepareOrder = await request(`/restaurant/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${restaurantToken}` },
    body: { status: 'preparing' }
  });
  assert(prepareOrder.status === 200 && prepareOrder.data.order.status === 'preparing', 'Kitchen marked order as preparing');

  const readyOrder = await request(`/restaurant/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${restaurantToken}` },
    body: { status: 'ready_for_pickup' }
  });
  assert(readyOrder.status === 200 && readyOrder.data.order.status === 'ready_for_pickup', 'Kitchen marked order ready for pickup');

  // 7. Delivery Partner Pickup & Complete Delivery
  console.log('\n▶ [7/8] Testing Eco-Delivery Partner Lifecycle...');
  const delDash = await request('/delivery/dashboard', {
    headers: { Authorization: `Bearer ${deliveryToken}` }
  });
  assert(delDash.status === 200, 'Delivery dashboard loaded');
  assert(delDash.data.active_assignment !== null, 'Order auto-assigned to nearest delivery partner');
  assignmentId = delDash.data.active_assignment.id;

  // Partner accepts
  const acceptRes = await request(`/delivery/assignments/${assignmentId}/respond`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${deliveryToken}` },
    body: { action: 'accept' }
  });
  assert(acceptRes.status === 200 && acceptRes.data.assignment.status === 'accepted', 'Delivery partner accepted assignment');

  // Partner picks up food from restaurant
  const pickupRes = await request(`/delivery/assignments/${assignmentId}/step`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${deliveryToken}` },
    body: { action: 'pickup' }
  });
  assert(pickupRes.status === 200 && pickupRes.data.assignment.status === 'picked_up', 'Partner confirmed food pickup from kitchen');

  // Partner marks delivered to customer
  const deliverRes = await request(`/delivery/assignments/${assignmentId}/step`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${deliveryToken}` },
    body: { action: 'deliver' }
  });
  assert(deliverRes.status === 200 && deliverRes.data.assignment.status === 'completed', 'Partner marked order delivered');

  // 8. Order Final Verification & History
  console.log('\n▶ [8/8] Verifying Final Order State & Customer History...');
  const finalOrder = await request(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(finalOrder.status === 200 && finalOrder.data.order.status === 'delivered', 'Order status is now delivered');

  const custHistory = await request('/orders/my-orders', {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(custHistory.status === 200 && custHistory.data.orders.some(o => o.id === orderId), 'Order appears in customer order history');

  console.log('\n======================================================');
  console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! (100%)');
  console.log('======================================================\n');
}

// Boot server on dynamic port and execute
server = app.listen(0, async () => {
  PORT = server.address().port;
  try {
    await runTests();
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('\n❌ TEST RUN FAILED:', err.message);
    server.close(() => process.exit(1));
  }
});
