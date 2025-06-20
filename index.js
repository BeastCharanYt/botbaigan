
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const express = require('express');
const path = require('path');

// ========== DISCORD BOT SETUP ==========
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ],
});

// ========== EXPRESS SERVER SETUP ==========
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const imagePath = path.join(__dirname, 'index.html');
  res.sendFile(imagePath);
});

app.listen(port, () => {
  console.log('\x1b[36m[ SERVER ]\x1b[0m', '\x1b[32m SH : http://localhost:' + port + ' ✅\x1b[0m');
});

// ========== RPC-LIKE BOT STATUS CONFIG ==========
const statusMessages = [
  { name: "Nav", type: ActivityType.Streaming, url: "https://github.com/BeastCharanYt" },
];

let currentStatusIndex = 0;

function updateStatus() {
  const status = statusMessages[currentStatusIndex];

  const presenceData = {
    activities: [{
      name: status.name,
      type: status.type,
    }],
    status: 'dnd', // Can be: 'online' | 'idle' | 'dnd'
  };

  if (status.type === ActivityType.Streaming && status.url) {
    presenceData.activities[0].url = status.url;
  }

  client.user.setPresence(presenceData);

  console.log('\x1b[33m[ STATUS ]\x1b[0m', `Updated status to: ${status.name} (${ActivityType[status.type]})`);

  currentStatusIndex = (currentStatusIndex + 1) % statusMessages.length;
}

// ========== HEARTBEAT LOG ==========
function heartbeat() {
  setInterval(() => {
    console.log('\x1b[35m[ HEARTBEAT ]\x1b[0m', `Bot is alive at ${new Date().toLocaleTimeString()}`);
  }, 30000);
}

// ========== LOGIN & EVENT HANDLER ==========
async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log('\x1b[36m[ LOGIN ]\x1b[0m', `\x1b[32mLogged in as: ${client.user.tag} ✅\x1b[0m`);
    console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[35mBot ID: ${client.user.id} \x1b[0m`);
    console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mConnected to ${client.guilds.cache.size} server(s) \x1b[0m`);
  } catch (error) {
    console.error('\x1b[31m[ ERROR ]\x1b[0m', 'Failed to log in:', error);
    process.exit(1);
  }
}

client.once('ready', () => {
  console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mPing: ${client.ws.ping} ms \x1b[0m`);
  updateStatus();
  setInterval(updateStatus, 10000); // change every 10 seconds
  heartbeat();
});

// ========== START ==========
login();
  
