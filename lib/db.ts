import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const isDbConfigured = Boolean(MONGODB_URI);

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    failed: boolean;
  };
}

const cached = global.mongooseCache || { conn: null, promise: null, failed: false };
global.mongooseCache = cached;

export async function connectDB() {
  if (!MONGODB_URI || cached.failed) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, { dbName: 'smart-kirana-store' });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.failed = true;
    cached.promise = null;
    cached.conn = null;
    console.error('Database connection failed. Falling back to preview mode.', error);
    return null;
  }
}

export async function isDatabaseReady() {
  if (!isDbConfigured) return false;
  const conn = await connectDB();
  return Boolean(conn);
}
