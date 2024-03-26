import cl from 'pg'

const client = new cl.Client({
  user: 'postgres',
  host: 'db',
  database: 'demo_database',
  password: '113',
  port: 5432,
});

client.connect()
  .then(() => {
    console.log('Connected');
  })
  .catch((err) => {
    console.error('Error connect', err);
  });

const text = 'CREATE DATABASE social_network';
await client.query(text);
console.log('Created Database!!');
client.end();
