const net = require('net');

const host = 'db.wremhnzyftbguqmbylia.supabase.co';
const ports = [5432, 6543];

ports.forEach(port => {
  const socket = new net.Socket();
  console.log(`Checking ${host}:${port}...`);
  
  socket.setTimeout(5000);
  socket.on('connect', () => {
    console.log(`[SUCCESS] Port ${port} is open!`);
    socket.destroy();
  });
  
  socket.on('timeout', () => {
    console.log(`[TIMEOUT] Port ${port} is closed or unreachable.`);
    socket.destroy();
  });
  
  socket.on('error', (err) => {
    console.log(`[ERROR] Port ${port}: ${err.message}`);
    socket.destroy();
  });
  
  socket.connect(port, host);
});
