module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '6b126410cebf308bfdb93c6deec0a0cd'),
  },
});
