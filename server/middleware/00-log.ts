export default defineEventHandler((event) => {
  console.log(`New ${event.node.req.method} request: ${event.path} at ${new Date()}`);
});