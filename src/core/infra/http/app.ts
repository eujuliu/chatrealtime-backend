import { PORT } from 'config';
import { server } from 'config/server';
import '../http/websocket';

server.listen(PORT, () => {
  console.log(`
    Server listening on ${PORT}
    -> Local: http://localhost:${PORT}
  `);
});
