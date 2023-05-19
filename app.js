const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const { Pool } = require('pg');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dbConfig = {
  host: 'langosta.ing.puc.cl',
  port: 5432,
  user: 'isidora.mora@uc.cl',
  password: '19639937',
  database: 'isidora.mora@uc.cl',
};

// Crea una instancia del Pool de conexiones
const pool = new Pool(dbConfig);


app.get("/", (req, res) => res.type("html").send(html));
app.post("/transactions", async (req, res) => {
  res.type("html").send(html);
  console.log("POST request received!");
  console.log(req.body.message);

  // Decode the data from base64
  const base64Data = req.body.message.data;
  const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');
  console.log("Decoded Data:", decodedData);

  // Extract the information from the message
  const operationType = decodedData.substr(0, 4);
  const messageId = decodedData.substr(4, 10);
  const sourceBank = decodedData.substr(14, 7).replace(/^0+/, '');
  const sourceAccount = decodedData.substr(21, 10).replace(/^0+/, '');
  const destinationBank = decodedData.substr(31, 7).replace(/^0+/, '');
  const destinationAccount = decodedData.substr(38, 10).replace(/^0+/, '');
  const amount = decodedData.substr(48, 16).replace(/^0+/, '');

  console.log("Tipo de operación:", operationType);
  console.log("Id de mensaje:", messageId);
  console.log("Banco de origen:", sourceBank);
  console.log("Cuenta origen:", sourceAccount);
  console.log("Banco de destino:", destinationBank);
  console.log("Cuenta destino:", destinationAccount);
  console.log("Monto:", amount);

  // Insert the transaction into the table
  try {
    const query = `
      INSERT INTO transactions (operation_type, message_id, source_bank, source_account, destination_bank, destination_account, amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;

    const values = [
      operationType,
      messageId,
      sourceBank,
      sourceAccount,
      destinationBank,
      destinationAccount,
      amount,
    ];

    const client = await pool.connect(); // Get a connection from the pool

    const result = await client.query(query, values); // Execute the query with values

    console.log("Transaction inserted with ID:", result.rows[0].id);

    client.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Error inserting transaction:", error);
  }
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>chao from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
    console.log("Hello from Render!");
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`;
