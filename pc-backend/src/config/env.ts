export const isProduction = process.env.NODE_ENV === 'production';
export const port = process.env.PORT ? Number(process.env.PORT) : 3000;
