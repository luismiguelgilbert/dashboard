export default defineEventHandler(async (event) => {
  console.log(`> ${getRequestURL(event).href} at ${Date.now()}`);
});
