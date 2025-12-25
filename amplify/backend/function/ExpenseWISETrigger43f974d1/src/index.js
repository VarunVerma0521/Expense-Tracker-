import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  try {
    const method = event.httpMethod || "POST";

    // ---------------- GET /expenses ----------------
    if (method === "GET") {
      const userId =
        event.queryStringParameters?.userId ||
        event.userId;

      if (!userId) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "userId is required" })
        };
      }

      const result = await dynamodb.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "PK = :pk AND UserID = :uid",
          ExpressionAttributeValues: {
            ":pk": "EXPENSE",
            ":uid": userId
          }
        })
      );

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({
          items: result.Items || []
        })
      };
    }

    // ---------------- POST /expenses ----------------
    const body =
      typeof event.body === "string"
        ? JSON.parse(event.body)
        : event;

    if (!body.amount || !body.category) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "amount and category are required" })
      };
    }

    const item = {
      PK: "EXPENSE",
      UserID: body.userId || "demo-user",
      expenseId: Date.now().toString(),
      amount: body.amount,
      category: body.category,
      createdAt: new Date().toISOString()
    };

    await dynamodb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({
        message: "Expense added successfully",
        item
      })
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message })
    };
  }
};
