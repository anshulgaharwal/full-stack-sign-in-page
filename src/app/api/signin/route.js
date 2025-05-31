// src/app/api/signin/route.js
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Incorrect password' }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: 'Sign-in successful', user: { id: user.id, name: user.name, email: user.email } }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
