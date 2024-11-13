import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import Airtable from 'airtable';

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});

var base = Airtable.base('appq3YuIZPi0gxuOb');

export default base;
