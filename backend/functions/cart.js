const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

// Get user's cart
exports.getCart = async (event) => {
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
        ':skPrefix': 'CART#',
      },
    };

    const result = await dynamodb.query(params).promise();
    
    const cartItems = result.Items.map(item => ({
      id: item.PK.split('#')[1],
      productId: item.productId,
      quantity: item.quantity || 1,
      price: item.price,
      name: item.name,
      image: item.image,
      createdAt: item.createdAt,
    }));

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        data: {
          items: cartItems,
          totals: {
            subtotal: Math.round(subtotal * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            shipping: Math.round(shipping * 100) / 100,
            total: Math.round(total * 100) / 100,
          },
        },
      }),
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch cart',
        error: error.message,
      }),
    };
  }
};

// Add item to cart
exports.addToCart = async (event) => {
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
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Product ID is required',
        }),
      };
    }

    // Check if product exists and get details
    const productParams = {
      TableName: tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
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
          message: 'Product not found',
        }),
      };
    }

    if (productResult.Item.stock < quantity) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Insufficient stock',
        }),
      };
    }

    const cartItemId = uuidv4();
    const now = new Date().toISOString();

    const cartItem = {
      PK: `CART#${cartItemId}`,
      SK: `CART#${cartItemId}`,
      GSI1PK: `USER#${userId}`,
      GSI1SK: `CART#${cartItemId}`,
      userId: userId,
      productId: productId,
      quantity: quantity,
      price: productResult.Item.price,
      name: productResult.Item.name,
      image: productResult.Item.images && productResult.Item.images.length > 0 ? productResult.Item.images[0] : null,
      createdAt: now,
      updatedAt: now,
    };

    const params = {
      TableName: tableName,
      Item: cartItem,
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        message: 'Item added to cart successfully',
        data: {
          id: cartItemId,
          productId: productId,
          quantity: quantity,
          price: productResult.Item.price,
        },
      }),
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to add item to cart',
        error: error.message,
      }),
    };
  }
};

// Update cart item
exports.updateCart = async (event) => {
  try {
    const userId = getUserId(event);
    const cartItemId = event.pathParameters.itemId;
    
    if (!userId) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
      };
    }

    if (!cartItemId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Cart item ID is required',
        }),
      };
    }

    const body = JSON.parse(event.body);
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Quantity must be greater than 0',
        }),
      };
    }

    // Check if cart item exists and belongs to user
    const cartParams = {
      TableName: tableName,
      Key: {
        PK: `CART#${cartItemId}`,
        SK: `CART#${cartItemId}`,
      },
    };

    const cartResult = await dynamodb.get(cartParams).promise();
    
    if (!cartResult.Item || cartResult.Item.userId !== userId) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Cart item not found',
        }),
      };
    }

    // Check if product has enough stock
    const productParams = {
      TableName: tableName,
      Key: {
        PK: `PRODUCT#${cartResult.Item.productId}`,
        SK: `PRODUCT#${cartResult.Item.productId}`,
      },
    };

    const productResult = await dynamodb.get(productParams).promise();
    
    if (productResult.Item.stock < quantity) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Insufficient stock',
        }),
      };
    }

    const now = new Date().toISOString();
    const params = {
      TableName: tableName,
      Key: {
        PK: `CART#${cartItemId}`,
        SK: `CART#${cartItemId}`,
      },
      UpdateExpression: 'SET quantity = :qty, updatedAt = :now',
      ExpressionAttributeValues: {
        ':qty': quantity,
        ':now': now,
      },
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
        message: 'Cart item updated successfully',
        data: {
          id: cartItemId,
          quantity: result.Attributes.quantity,
          price: result.Attributes.price,
        },
      }),
    };
  } catch (error) {
    console.error('Error updating cart:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to update cart item',
        error: error.message,
      }),
    };
  }
};

// Remove item from cart
exports.removeFromCart = async (event) => {
  try {
    const userId = getUserId(event);
    const cartItemId = event.pathParameters.itemId;
    
    if (!userId) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
      };
    }

    if (!cartItemId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Cart item ID is required',
        }),
      };
    }

    // Check if cart item exists and belongs to user
    const cartParams = {
      TableName: tableName,
      Key: {
        PK: `CART#${cartItemId}`,
        SK: `CART#${cartItemId}`,
      },
    };

    const cartResult = await dynamodb.get(cartParams).promise();
    
    if (!cartResult.Item || cartResult.Item.userId !== userId) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Cart item not found',
        }),
      };
    }

    const params = {
      TableName: tableName,
      Key: {
        PK: `CART#${cartItemId}`,
        SK: `CART#${cartItemId}`,
      },
    };

    await dynamodb.delete(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        message: 'Item removed from cart successfully',
      }),
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to remove item from cart',
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