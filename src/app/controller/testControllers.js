import cl from 'pg'
import { faker } from '@faker-js/faker/locale/vi';

/*const client = new cl.Client({
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

await client.query('CREATE TABLE profile(name VARCHAR(255), info VARCHAR(255),year INT)');
for (let i = 0; i < 10; i++)
  await client.query(`INSERT INTO profile(name, info, year) VALUES ('${faker.person.fullName()}', '${faker.person.fullName()}', '${faker.number.int({ min: 1924, max: 2024 })}')`)
const res1 = await client.query('SELECT * FROM profile');

const index  = (req,res) => {
    res.send(res1.rows);
}

client.end();*/

const index  = (req,res) => {
    res.send('OK');
}

export {index}
