import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'ExpenseWISE-dev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'UserID = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    });

    const response = await docClient.send(command);
    const items = response.Items || [];
    // Parse dates back to Date objects and map to expected format
    const expenses = items.map((item: any) => ({
      id: item.PK,
      userId: item.UserID,
      date: new Date(item.date as string),
      amount: item.amount,
      category: item.category,
      note: item.note,
    }));
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, date, amount, category, note, userId } = body;

    if (!id || !date || !amount || !category || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: id,
        UserID: userId,
        date,
        amount,
        category,
        note,
      },
    });

    await docClient.send(command);
    return NextResponse.json({ message: 'Expense created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, date, amount, category, note, userId } = body;

    if (!id || !userId) {
      return NextResponse.json({ error: 'ID and User ID required' }, { status: 400 });
    }

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: id, UserID: userId },
      UpdateExpression: 'SET #date = :date, amount = :amount, category = :category, #note = :note',
      ExpressionAttributeNames: {
        '#date': 'date',
        '#note': 'note',
      },
      ExpressionAttributeValues: {
        ':date': date,
        ':amount': amount,
        ':category': category,
        ':note': note,
      },
    });

    await docClient.send(command);
    return NextResponse.json({ message: 'Expense updated' });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json({ error: 'ID and User ID required' }, { status: 400 });
    }

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: id, UserID: userId },
    });

    await docClient.send(command);
    return NextResponse.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
