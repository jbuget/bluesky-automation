import 'dotenv/config';
import ATProtocole from '@atproto/api';
import { createRestAPIClient, } from 'masto';
function getEnvString(key) {
    return process.env[key] || 'undefined';
}
const { BskyAgent } = ATProtocole;
let blueskyClient;
let mastodonClient;
async function connectClients() {
    console.log('Connect to Bluesky…');
    blueskyClient = new BskyAgent({ service: getEnvString('BLUESKY_URL') });
    await blueskyClient.login({
        identifier: getEnvString('BLUESKY_IDENTIFIER'),
        password: getEnvString('BLUESKY_PASSWORD'),
    });
    console.log('Connection to Bluesky acquired.');
    console.log('Connect to Mastodon…');
    mastodonClient = createRestAPIClient({
        url: getEnvString('MASTODON_URL'),
        accessToken: getEnvString('MASTODON_ACCESS_TOKEN')
    });
    console.log('Connection to Mastodon acquired.');
}
async function postMessage(message) {
    console.log('Publish message on Bluesky…');
    await blueskyClient.post({
        text: message
    });
    console.log('Message published on Bluesky.');
    console.log('Publish message on Mastodon…');
    const status = await mastodonClient.v1.statuses.create({
        status: message,
        visibility: 'public',
    });
    console.log('Message published on Mastodon.');
}
await connectClients();
const message = 'Vive le web ouvert et libre !';
await postMessage(message);
