import { PORT } from 'config';
import { server } from 'config/server';
import 'infra/http/api/websocket';

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
