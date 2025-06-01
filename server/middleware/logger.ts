export default defineEventHandler(async (event) => {
  console.log(`> ${getRequestURL(event).href} at ${new Date().toISOString()}`);
});
