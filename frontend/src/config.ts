export const isProduction = process.env.NODE_ENV === "production";
console.log(process.env.NEXT_PUBLIC_API_URL);
if (isProduction) {
  // turn off console.log in production
  console.log = () => {};
}
