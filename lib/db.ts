import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const isDbConfigured = Boolean(MONGODB_URI);

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  if (!MONGODB_URI) {
    return null;
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: 'smart-kirana-store' });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
