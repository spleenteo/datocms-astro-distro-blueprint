import { exec } from 'node:child_process';
import { subscribeToQuery } from 'datocms-listen';
import { EventSource } from 'eventsource';
import dotenv from 'dotenv-safe';
import { datocmsEnvironment } from '../datocms-environment';

dotenv.config();

const command = 'npm run prep:download-translations';
const query = /* graphql */ `
  query AllTranslations {
    _allTranslationsMeta {
      count
    }
    translation {
      key
      value
      _updatedAt
    }
  }
`;
let updates = 0;

function watchTranslations() {
  subscribeToQuery({
    query,
    fetcher: fetch,
    eventSourceClass: EventSource,
    environment: datocmsEnvironment,
    token: process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN!,
    includeDrafts: true,
    onUpdate: () => {
      updates++;
      if (updates <= 1) {
        console.log('Watching translations in DatoCMS');
        return; // ignore first update as it's the initial data
      }
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error downloading translations:', error);
          console.error(stderr);
          return;
        }
        console.log(stdout);
      });
    },
    onChannelError: (error) => {
      console.error('Watch translations error:', error);
    },
  });
}

watchTranslations();
