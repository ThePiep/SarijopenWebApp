'use client';

import { kookploeg_gebruikers } from '@/models/kookploeg_gebruikers';
import { kookploeg_momenten } from '@/models/kookploeg_momenten';
import {
  KookploegMomentEter,
  removeKokFromKookploegMoment,
} from '@/util/kookploeg';
import { useMemo, useState, useTransition } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { LinkButton } from '../Button/LinkButton';
import {
  addKok,
  gastIntekenen,
  intekenen,
  removeKok,
  startMoment,
  uittekenen,
} from '@/app/kookploeg/actions';
import { useSession } from 'next-auth/react';
import { KookploegId } from './KPCard';
import { CircleButton } from '../Button/CircleButton';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  kok?: KookploegMomentEter;
  eters?: KookploegMomentEter[];
  moment?: kookploeg_momenten;
  kookploeg_id: KookploegId;
  day_string: string;
}

export const KPCardActions = ({
  kok,
  eters,
  moment,
  kookploeg_id,
  day_string,
}: Props) => {
  const datum = dayjs(day_string);
  console.log({ datumAtClient: datum, day_string });
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { data } = useSession();

  const isIngetekent = useMemo(() => {
    return (
      eters &&
      !!eters.find((e) => e.GebruikerID === data?.user.kookploeg_gebruiker_id)
    );
  }, [eters]);

  const expandedButtons = [
    {
      name: !!kok ? `Schrijf ${kok?.naam} uit als kok` : 'Inschrijven als kok',
      props: {
        onClick: () => {
          !!kok
            ? startTransition(() => removeKok(moment.ID, kookploeg_id))
            : startTransition(() =>
                addKok(
                  moment?.ID,
                  data?.user.kookploeg_gebruiker_id,
                  kookploeg_id
                )
              );
        },
        disabled: !isIngetekent,
      },
    },
    // {
    //   name: 'Bedrag invullen',
    //   props: { disabled: true },
    // },
    // {
    //   name: 'Moment sluiten',
    //   props: { disabled: true },
    // },
    // {
    //   name: 'ETA invullen',
    //   props: { disabled: true },
    // },
    // {
    //   name: 'Commentaar toevoegen',
    //   props: { disabled: true },
    // },
    // {
    //   name: 'Logboek bekijken',
    //   props: { disabled: true },
    // },
    // {
    //   name: "Saldo's bekijken",
    //   props: { disabled: true },
    // },
  ];

  return (
    <>
      <div className='flex grid-cols-3 justify-between'>
        <LinkButton
          disabled={!isIngetekent}
          onClick={() => {
            startTransition(() =>
              uittekenen(
                moment?.ID,
                data?.user.kookploeg_gebruiker_id,
                kookploeg_id
              )
            );
          }}
        >
          Uittekenen
        </LinkButton>
        <CircleButton
          className='text-sky-700'
          onClick={(e) => setExpanded((x) => !x)}
        >
          {expanded ? (
            <FaArrowUp color='sky-700' />
          ) : (
            <FaArrowDown color='sky-700' />
          )}
        </CircleButton>
        <LinkButton
          onClick={() => {
            moment
              ? startTransition(() =>
                  intekenen(
                    moment?.ID,
                    data?.user.kookploeg_gebruiker_id,
                    kookploeg_id
                  )
                )
              : startTransition(() =>
                  startMoment(
                    data?.user.kookploeg_gebruiker_id,
                    kookploeg_id,
                    datum.format('YYYY-MM-DD')
                  )
                );
          }}
        >
          {isIngetekent ? 'Gast intekenen' : 'Intekenen'}
        </LinkButton>
      </div>
      {expanded && (
        <ul className={'border-t-2 border-slate-800 pt-4 mt-3'}>
          {expandedButtons.map((button, index) => (
            <li key={index}>
              <LinkButton
                className={`${index ? 'mt-2' : ''}`}
                {...button.props}
              >
                {button.name}
              </LinkButton>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
