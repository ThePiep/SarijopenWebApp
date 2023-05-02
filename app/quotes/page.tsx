export const revalidate = 10;

import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/nl';
import { uitspraken } from '@/models/uitspraken';
import sequelize from '@/lib/sequelize';
import { initModels } from '@/models/init-models';
import { getBewoners } from '@/util/bewoners';
import { UitspraakForm } from './UitspraakForm';

dayjs.extend(updateLocale);
dayjs.locale('nl');

dayjs.extend(relativeTime);

export async function getQuotes() {
  initModels(sequelize);
  const obj = await uitspraken.findAll({
    limit: 10,
    order: [['id', 'desc']],
  });

  const bewoners = await getBewoners();

  return { obj, bewoners };
}

export default async function Quotes() {
  const { obj, bewoners } = await getQuotes();

  return (
    <>
      <UitspraakForm bewoners={bewoners}>
        {obj.map((u, index) => {
          const auteur = u.gast.length
            ? u.gast
            : bewoners.find((b) => b.id === u.bewonerID)?.naam ?? u.bewonerID;
          const ontvanger = u.tegengast.length
            ? u.tegengast
            : bewoners.find((b) => b.id === u.tegenbewonerID)?.naam ??
              undefined;
          const tijd = dayjs(`${u.datum} ${u.tijd}`);
          return (
            <div key={index} className='chat chat-start mb-1'>
              <div className='chat-header'>
                {`${auteur} ${ontvanger ? `tegen ${ontvanger}` : ''}  `}
                <div
                  className='tooltip tooltip-right '
                  data-tip={tijd.format('DD/MM/YYYY HH:mm')}
                >
                  <time className='text-cs opacity-50'>{tijd.fromNow()}</time>
                </div>
              </div>
              <div className='chat-bubble'>{u.uitspraak}</div>
            </div>
          );
        })}
      </UitspraakForm>
    </>
  );
}
