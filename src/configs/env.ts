const env = {
  PORT: process.env.PORT as string,
  MONGODB_URI: process.env.DATABASE_URL as string,
  JWT_SECRET_KEY: process.env.JTW_SECRET_KEY as string,
};

export { env };
