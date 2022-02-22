export const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  // turn off console.log in production
  console.log = () => {};
}
