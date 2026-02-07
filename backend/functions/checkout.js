const AWS = require('aws-sdk');
const Stripe = require('stripe');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
exports.createCheckoutSession = async (event) => {
  try {
    const userId = getUserId(event);
    
    if (!userId) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
      };
    }

    const body = JSON.parse(event.body);
    const { shippingAddress, billingAddress, deliveryDate, giftMessage } = body;

    if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Shipping address is required',
        }),
      };
    }

    // Get user's cart
    const cartParams = {
      TableName: tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':skPrefix': 'CART#',
      },
    };

    const cartResult = await dynamodb.query(cartParams).promise();
    
    if (!cartResult.Items || cartResult.Items.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Cart is empty',
        }),
      };
    }

    // Get product details and check stock
    const lineItems = [];
    let totalAmount = 0;

    for (const cartItem of cartResult.Items) {
      const productParams = {
        TableName: tableName,
        Key: {
          PK: `PRODUCT#${cartItem.productId}`,
          SK: `PRODUCT#${cartItem.productId}`,
        },
      };

      const productResult = await dynamodb.get(productParams).promise();
      
      if (!productResult.Item) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
          },
          body: JSON.stringify({
            success: false,
            message: `Product ${cartItem.productId} not found`,
          }),
        };
      }

      if (productResult.Item.stock < cartItem.quantity) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
          },
          body: JSON.stringify({
            success: false,
            message: `Insufficient stock for ${productResult.Item.name}`,
          }),
        };
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: productResult.Item.name,
            description: productResult.Item.description,
            images: productResult.Item.images && productResult.Item.images.length > 0 ? [productResult.Item.images[0]] : [],
          },
          unit_amount: Math.round(productResult.Item.price * 100), // Stripe expects amount in cents
        },
        quantity: cartItem.quantity,
      });

      totalAmount += productResult.Item.price * cartItem.quantity;
    }

    // Calculate totals
    const tax = totalAmount * 0.08; // 8% tax
    const shipping = totalAmount > 50 ? 0 : 9.99; // Free shipping over $50
    const total = totalAmount + tax + shipping;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        userId: userId,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress || shippingAddress),
        deliveryDate: deliveryDate || '',
        giftMessage: giftMessage || '',
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shipping * 100),
              currency: 'usd',
            },
            display_name: shipping === 0 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'day', value: 3 },
              maximum: { unit: 'day', value: 7 },
            },
          },
        },
      ],
    });

    // Create order in DynamoDB
    const orderId = uuidv4();
    const now = new Date().toISOString();

    const order = {
      PK: `ORDER#${orderId}`,
      SK: `ORDER#${orderId}`,
      GSI1PK: `USER#${userId}`,
      GSI1SK: `ORDER#${orderId}`,
      userId: userId,
      status: 'pending',
      paymentStatus: 'pending',
      paymentIntentId: session.payment_intent,
      stripeSessionId: session.id,
      items: cartResult.Items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      })),
      totals: {
        subtotal: Math.round(totalAmount * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        shipping: Math.round(shipping * 100) / 100,
        total: Math.round(total * 100) / 100,
      },
      shippingAddress: shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      deliveryDate: deliveryDate || null,
      giftMessage: giftMessage || null,
      createdAt: now,
      updatedAt: now,
    };

    const orderParams = {
      TableName: tableName,
      Item: order,
    };

    await dynamodb.put(orderParams).promise();

    // Clear cart after successful order creation
    for (const cartItem of cartResult.Items) {
      await dynamodb.delete({
        TableName: tableName,
        Key: {
          PK: cartItem.PK,
          SK: cartItem.SK,
        },
      }).promise();
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        message: 'Checkout session created successfully',
        data: {
          sessionId: session.id,
          url: session.url,
          orderId: orderId,
        },
      }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to create checkout session',
        error: error.message,
      }),
    };
  }
};

// Webhook handler for Stripe events
exports.stripeWebhook = async (event) => {
  try {
    const sig = event.headers['stripe-signature'];
    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Webhook signature verification failed' }),
      };
    }

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;

      // Update order status
      const params = {
        TableName: tableName,
        Key: {
          PK: `ORDER#${session.metadata.orderId}`,
          SK: `ORDER#${session.metadata.orderId}`,
        },
        UpdateExpression: 'SET paymentStatus = :status, updatedAt = :now',
        ExpressionAttributeValues: {
          ':status': 'paid',
          ':now': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      };

      await dynamodb.update(params).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Helper function to get user ID from event
function getUserId(event) {
  // For AWS IAM authorization
  if (event.requestContext && event.requestContext.authorizer) {
    return event.requestContext.authorizer.claims.sub;
  }
  
  // For Cognito User Pools authorization
  if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims) {
    return event.requestContext.authorizer.claims.sub;
  }
  
  // For custom authorizers
  if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.principalId) {
    return event.requestContext.authorizer.principalId;
  }
  
  return null;
}