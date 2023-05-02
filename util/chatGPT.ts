import dayjs from 'dayjs';
import { chatGPTArtikelCache } from './cache';

export interface ChatGPTArtikelType {
  titel: string;
  inhoud: string;
}

const processChatGPTArtikel = (text: string): ChatGPTArtikelType => {
  text = text.replace(/(\r\n|\n|\r)/gm, ' '); // remove newlines
  text = text.replace(/ +(?= )/g, ''); // remove multiple spaces
  const titelIndex = text.toLowerCase().indexOf('titel');
  const inhoudIndex = text.toLowerCase().indexOf('inhoud');
  let failed = false;
  console.log('new chatGPT art resp', { titelIndex, inhoudIndex });
  if (titelIndex === -1 || inhoudIndex === -1) {
    failed = true;
  }

  const titel = text.substring(titelIndex + 6, inhoudIndex - 1);
  const inhoud = text.substring(inhoudIndex + 7);

  if (failed) {
    return { titel: 'failed', inhoud: text };
  }

  return { titel, inhoud };
};

export const getChatGPTArtikel =
  async (): Promise<ChatGPTArtikelType | null> => {
    const cached = await chatGPTArtikelCache.get('chatGPTArtikelString');
    if (cached) {
      console.log('GPT Artikel cache hit');
      return processChatGPTArtikel(cached);
    } else {
      const res = await getChatFreshGPTArtikel();
      if (!res.ok) {
        return null;
      }

      const json = await res.json();
      let text = json.choices[0].text as string;
      console.log('Caching chatGPT artikel for 24 hours');
      chatGPTArtikelCache.put(
        'chatGPTArtikelString',
        text + ' - from cache - ' + dayjs().format('HH:mm'),
        1000 * 60 * 60 * 24
      ); // cache for 24 hours

      const result = processChatGPTArtikel(text);

      if (result.inhoud === 'failed') {
        console.log('failed bij nieuwe call');
      }

      return result;
    }
  };

export const getChatFreshGPTArtikel = async () => {
  console.log('ASKING CHATGPT!');

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${process.env.OPENAI_API_KEY}`);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    model: 'text-davinci-003',
    prompt:
      'Schrijf een satirisch nieuws artikel met als format: \n \n titel: [titel van het artikel] \n inhoud: [inhoud van het artikel]',
    max_tokens: 250,
    temperature: 0.7,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  const res = await fetch(
    'https://api.openai.com/v1/completions',
    requestOptions
  );

  return res;
};
