const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

// Schema validation
const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().valid('rakhi', 'chocolate-combo', 'roli-moli', 'flowers', 'hampers').required(),
  images: Joi.array().items(Joi.string()).default([]),
  stock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().max(50).required(),
  weight: Joi.number().positive().optional(),
  dimensions: Joi.object({
    length: Joi.number().positive().optional(),
    width: Joi.number().positive().optional(),
    height: Joi.number().positive().optional(),
  }).optional(),
  isActive: Joi.boolean().default(true),
  deliveryInfo: Joi.object({
    estimatedDays: Joi.number().integer().min(1).max(30).required(),
    availableZipCodes: Joi.array().items(Joi.string()).default([]),
  }).required(),
});

// Get all products
exports.getProducts = async (event) => {
  try {
    const params = {
      TableName: tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'PRODUCT#ACTIVE',
      },
      FilterExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': true,
      },
    };

    const result = await dynamodb.query(params).promise();
    
    const products = result.Items.map(item => ({
      id: item.PK.split('#')[1],
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      images: item.images || [],
      stock: item.stock || 0,
      sku: item.sku,
      weight: item.weight,
      dimensions: item.dimensions,
      deliveryInfo: item.deliveryInfo,
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
        data: products,
        count: products.length,
      }),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      }),
    };
  }
};

// Get single product
exports.getProduct = async (event) => {
  try {
    const productId = event.pathParameters.id;
    
    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Product ID is required',
        }),
      };
    }

    const params = {
      TableName: tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
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
          message: 'Product not found',
        }),
      };
    }

    const product = {
      id: result.Item.PK.split('#')[1],
      name: result.Item.name,
      description: result.Item.description,
      price: result.Item.price,
      category: result.Item.category,
      images: result.Item.images || [],
      stock: result.Item.stock || 0,
      sku: result.Item.sku,
      weight: result.Item.weight,
      dimensions: result.Item.dimensions,
      deliveryInfo: result.Item.deliveryInfo,
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
        data: product,
      }),
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch product',
        error: error.message,
      }),
    };
  }
};

// Create product (Admin only)
exports.createProduct = async (event) => {
  try {
    const body = JSON.parse(event.body);
    
    // Validate input
    const { error, value } = productSchema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid input',
          errors: error.details.map(d => d.message),
        }),
      };
    }

    const productId = uuidv4();
    const now = new Date().toISOString();

    const product = {
      PK: `PRODUCT#${productId}`,
      SK: `PRODUCT#${productId}`,
      GSI1PK: value.isActive ? 'PRODUCT#ACTIVE' : 'PRODUCT#INACTIVE',
      GSI1SK: `PRODUCT#${productId}`,
      ...value,
      id: productId,
      createdAt: now,
      updatedAt: now,
    };

    const params = {
      TableName: tableName,
      Item: product,
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
        message: 'Product created successfully',
        data: {
          id: productId,
          name: product.name,
          price: product.price,
        },
      }),
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to create product',
        error: error.message,
      }),
    };
  }
};

// Update product (Admin only)
exports.updateProduct = async (event) => {
  try {
    const productId = event.pathParameters.id;
    const body = JSON.parse(event.body);

    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Product ID is required',
        }),
      };
    }

    // Validate input
    const { error, value } = productSchema.validate(body, { allowUnknown: true });
    if (error) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid input',
          errors: error.details.map(d => d.message),
        }),
      };
    }

    const now = new Date().toISOString();
    const updateExpression = ['SET updatedAt = :now'];
    const expressionAttributeValues = { ':now': now };
    const expressionAttributeNames = {};

    // Build update expression dynamically
    Object.keys(value).forEach(key => {
      const dbKey = key.toUpperCase() === key ? key : key.charAt(0).toUpperCase() + key.slice(1);
      updateExpression.push(`, ${dbKey} = :${key}`);
      expressionAttributeValues[`:${key}`] = value[key];
      expressionAttributeNames[`#${key}`] = dbKey;
    });

    const params = {
      TableName: tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
      },
      UpdateExpression: updateExpression.join(''),
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
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
        message: 'Product updated successfully',
        data: {
          id: productId,
          ...result.Attributes,
        },
      }),
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to update product',
        error: error.message,
      }),
    };
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (event) => {
  try {
    const productId = event.pathParameters.id;

    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
        },
        body: JSON.stringify({
          success: false,
          message: 'Product ID is required',
        }),
      };
    }

    const params = {
      TableName: tableName,
      Key: {
        PK: `PRODUCT#${productId}`,
        SK: `PRODUCT#${productId}`,
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
        message: 'Product deleted successfully',
      }),
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to delete product',
        error: error.message,
      }),
    };
  }
};