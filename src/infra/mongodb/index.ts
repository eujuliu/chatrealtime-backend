import { MONGODB_URL } from 'config';
import mongoose from 'mongoose';

mongoose.connect(MONGODB_URL);
