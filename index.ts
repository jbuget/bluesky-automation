import 'dotenv/config'
import ATProtocole from '@atproto/api'
import { createRestAPIClient, } from 'masto'
import Airtable from 'airtable'

function getEnvString(key: string): string {
    return process.env[key] || 'undefined'
}

const { BskyAgent } = ATProtocole;

let blueskyClient: ATProtocole.BskyAgent

let mastodonClient: any

let airtableClient: any

async function connectClients(): Promise<void> {
    console.log('Connect to Bluesky…')
    blueskyClient = new BskyAgent({ service: getEnvString('BLUESKY_URL') })
    await blueskyClient.login({
        identifier: getEnvString('BLUESKY_IDENTIFIER'),
        password: getEnvString('BLUESKY_PASSWORD'),
    });
    console.log('Connection to Bluesky acquired.')

    console.log('Connect to Mastodon…')
    mastodonClient = createRestAPIClient({ 
        url: getEnvString('MASTODON_URL'), 
        accessToken: getEnvString('MASTODON_ACCESS_TOKEN') 
    })
    console.log('Connection to Mastodon acquired.')

    airtableClient = new Airtable({endpointUrl: 'https://api-airtable-com-8hw7i1oz63iz.runscope.net/'})
}

async function postMessage(message: string): Promise<void> {
    console.log('Publish message on Bluesky…')
    await blueskyClient.post({
        text: message
    });
    console.log('Message published on Bluesky.')

    console.log('Publish message on Mastodon…')
    const status = await mastodonClient.v1.statuses.create({
        status: message,
        visibility: 'public',
    });
    console.log('Message published on Mastodon.')
}

await connectClients()

const message = 'Vive le web ouvert et libre !'

// await postMessage(message)
