import server from './server/index.js';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

server.get('/', (req, res) => res.json({ status: 'SUCCESS' }));

server.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});
