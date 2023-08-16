import { PORT } from 'config';
import { server } from 'config/server';
import './websocket';

server.listen(PORT, () => {
  console.log(`
    Server listening on ${PORT}
    -> Local: http://localhost:${PORT}
  `);
});
