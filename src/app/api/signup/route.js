import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    const checkUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (checkUser.rows.length > 0) {
      client.release();
      return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
    }

    await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
    client.release();

    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Something went wrong.', error: error.message }, { status: 500 });
  }
}
