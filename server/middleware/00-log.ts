export default defineEventHandler((event) => {
  console.log(`New request - ${event.node.req.method} : ${getRequestURL(event)} at ${new Date()}`);
})