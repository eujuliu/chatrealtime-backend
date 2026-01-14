import 'dotenv/config';

const PORT = process.env.PORT || '3000';
const SECRET = process.env.SECRET as string;
const MONGODB_URL = process.env.MONGODB_URL as string;
const NODE_ENV = process.env.NODE_ENV as string;
const MYSQL_HOST = process.env.MYSQL_HOST as string;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE as string;
const MYSQL_USERNAME = process.env.MYSQL_USERNAME as string;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD as string;

export { PORT, SECRET, MONGODB_URL, NODE_ENV, MYSQL_HOST, MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD };
