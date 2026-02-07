const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

// Get user's orders
exports.getOrders = async (event) => {
  try {
    const userId = getUserId(event);
    
    if (!userId) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
      };
    }

    const params = {
      TableName: tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':skPrefix': 'ORDER#',
      },
      ScanIndexForward: false, // Sort by date descending
    };

    const result = await dynamodb.query(params).promise();
    
    const orders = result.Items.map(item => ({
      id: item.PK.split('#')[1],
      status: item.status,
      paymentStatus: item.paymentStatus,
      paymentIntentId: item.paymentIntentId,
      stripeSessionId: item.stripeSessionId,
      items: item.items,
      totals: item.totals,
      shippingAddress: item.shippingAddress,
      billingAddress: item.billingAddress,
      deliveryDate: item.deliveryDate,
      giftMessage: item.giftMessage,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        data: orders,
        count: orders.length,
      }),
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message,
      }),
    };
  }
};

// Get single order
exports.getOrder = async (event) => {
  try {
    const userId = getUserId(event);
    const orderId = event.pathParameters.id;
    
    if (!userId) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
      };
    }

    if (!orderId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Order ID is required',
        }),
      };
    }

    const params = {
      TableName: tableName,
      Key: {
        PK: `ORDER#${orderId}`,
        SK: `ORDER#${orderId}`,
      },
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Order not found',
        }),
      };
    }

    // Check if order belongs to user
    if (result.Item.userId !== userId) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Access denied',
        }),
      };
    }

    const order = {
      id: result.Item.PK.split('#')[1],
      status: result.Item.status,
      paymentStatus: result.Item.paymentStatus,
      paymentIntentId: result.Item.paymentIntentId,
      stripeSessionId: result.Item.stripeSessionId,
      items: result.Item.items,
      totals: result.Item.totals,
      shippingAddress: result.Item.shippingAddress,
      billingAddress: result.Item.billingAddress,
      deliveryDate: result.Item.deliveryDate,
      giftMessage: result.Item.giftMessage,
      createdAt: result.Item.createdAt,
      updatedAt: result.Item.updatedAt,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        data: order,
      }),
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch order',
        error: error.message,
      }),
    };
  }
};

// Admin: Get all orders
exports.getAdminOrders = async (event) => {
  try {
    const params = {
      TableName: tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'begins_with(GSI1PK, :prefix)',
      ExpressionAttributeValues: {
        ':prefix': 'ORDER#',
      },
      ScanIndexForward: false, // Sort by date descending
    };

    const result = await dynamodb.query(params).promise();
    
    const orders = result.Items.map(item => ({
      id: item.PK.split('#')[1],
      userId: item.userId,
      status: item.status,
      paymentStatus: item.paymentStatus,
      paymentIntentId: item.paymentIntentId,
      stripeSessionId: item.stripeSessionId,
      items: item.items,
      totals: item.totals,
      shippingAddress: item.shippingAddress,
      billingAddress: item.billingAddress,
      deliveryDate: item.deliveryDate,
      giftMessage: item.giftMessage,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        data: orders,
        count: orders.length,
      }),
    };
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message,
      }),
    };
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (event) => {
  try {
    const orderId = event.pathParameters.id;
    const body = JSON.parse(event.body);
    const { status, trackingNumber } = body;

    if (!orderId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Order ID is required',
        }),
      };
    }

    if (!status) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Order status is required',
        }),
      };
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid order status',
        }),
      };
    }

    const now = new Date().toISOString();
    const updateExpression = ['SET status = :status, updatedAt = :now'];
    const expressionAttributeValues = {
      ':status': status,
      ':now': now,
    };

    if (trackingNumber) {
      updateExpression.push(', trackingNumber = :tracking');
      expressionAttributeValues[':tracking'] = trackingNumber;
    }

    const params = {
      TableName: tableName,
      Key: {
        PK: `ORDER#${orderId}`,
        SK: `ORDER#${orderId}`,
      },
      UpdateExpression: updateExpression.join(''),
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        message: 'Order status updated successfully',
        data: {
          id: orderId,
          status: result.Attributes.status,
          trackingNumber: result.Attributes.trackingNumber,
        },
      }),
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to update order status',
        error: error.message,
      }),
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