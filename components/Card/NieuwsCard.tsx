export const revalidate = 600;

import { getChatGPTArtikel } from '@/util/chatGPT';
import { Card, CardProps } from './Card';
import { generateRssFeed } from '@/util/generateRSSFeed';

interface Props extends Omit<CardProps, 'title'> {}

export const NieuwsCard = async ({ ...props }: Props) => {
  const chatGPTArtikel = await getChatGPTArtikel();
  await generateRssFeed();

  return (
    <Card title={chatGPTArtikel?.titel ?? 'Nieuws'} {...props}>
      <p>
        {chatGPTArtikel?.inhoud ??
          'Er is iets misgegaan, schop je lokale webmaster.'}
      </p>
    </Card>
  );
};

// Ha! Jij dacht natuurlijk dat dit een artikel van de Speld was. Maar dat is het niet. Dit artikel is vakkundig gefabriceerd door onze maten van openAI.

// Maar goed, grote kans dat jij dit leest in een niet zo verre toekomst waarin dit de normaalste zaak van de wereld is. Of sterker nog, jij bent op dit moment onder het gezag van je kunstmatig intelligente gezaghebbers die menselijke satire maar voorspelbaar, onnatuurlijk en nep vinden. Toch zijn ze trots op hoe ze mensen in een kamp hebben getraint echt intelligente humor te schrijven en begrijpen. Of athans, echt begrijpen zullen die mensen natuurlijk nooit.

// P.S. Lukt het jouw om onze grote vriend chadGPT nog leuker te laten antwoorden? Schop dan vooral lokale webmaster en misschien wordt dit werkelijkheid.
