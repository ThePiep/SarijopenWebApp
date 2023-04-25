'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { InferType, Schema, number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormTextarea } from '@/components/Input/FormTextarea';
import React from 'react';
import { FormBewonerGastInput } from '@/components/Input/FormBewonerGastInput';
import { nieuweUitspraakSchema as schema } from '../api/quotes/schema';
import { bewoners } from '@/models/bewoners';
import { Spinner } from '@/components/Spinner';

interface Props {
  children: React.ReactNode;
  bewoners: bewoners[];
}

type FormData = InferType<typeof schema>;

export const UitspraakForm = ({ bewoners, children }: Props) => {
  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [showForm, setShowForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleCancel = () => {
    methods.reset();
    setShowForm(false);
  };

  const onSubmit = async (data: FormData) => {
    alert(JSON.stringify(data));
    setLoading(true);
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setLoading(false);
      setShowForm(false);
      methods.reset();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const bewonerOptions = bewoners
    .sort((a, b) => {
      return a.huidig && !b.huidig
        ? -1
        : !a.huidig && b.huidig
        ? 1
        : a.naam.toLowerCase() > b.naam.toLowerCase()
        ? 1
        : -1;
    })
    .map((b) => ({ label: b.naam, value: b.id }));

  return (
    <FormProvider {...methods}>
      <div
        className={`transition-[max-height] ease-in-out duration-400 overflow-hidden  ${
          showForm ? 'max-h-80' : 'max-h-0'
        }`}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className='form-control grid grid-cols-6 md:grid-cols-12 gap-x-4'>
            <div className='col-span-6'>
              <FormBewonerGastInput
                label='Door'
                schema={schema}
                bewonerFormName={'bewonerID'}
                gastFormName={'gast'}
                options={bewonerOptions}
              />
            </div>
            <div className='col-span-6'>
              <FormBewonerGastInput
                label='Tegen'
                schema={schema}
                bewonerFormName={'tegenbewonerID'}
                gastFormName={'tegengast'}
                options={bewonerOptions}
              />
            </div>
            <div className='col-span-full'>
              <FormTextarea label='Uitspraak' name='uitspraak' />
            </div>
          </div>
        </form>
      </div>

      <div className='divider mt-8'>
        {!showForm ? (
          <div className='btn' onClick={() => setShowForm(true)}>
            Nieuw uitspraak
          </div>
        ) : loading ? (
          <Spinner />
        ) : (
          <>
            <button className='btn' onClick={() => handleCancel()}>
              Annuleren
            </button>
            <button
              className='btn'
              onClick={() => methods.handleSubmit(onSubmit)()}
            >
              Opslaan
            </button>
          </>
        )}
      </div>

      {/* {children} */}
    </FormProvider>
  );
};
