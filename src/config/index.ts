import 'dotenv/config';

const PORT = process.env.PORT;
const SECRET = process.env.SECRET as string;
const MONGODB_URL = process.env.MONGODB_URL as string;
const NODE_ENV = process.env.NODE_ENV as string;

export { PORT, SECRET, MONGODB_URL, NODE_ENV };
