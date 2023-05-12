'use server';

import { KookploegId } from '@/components/Card/KPCard';
import {
  removeKokFromKookploegMoment,
  setKokForKookploegMoment,
  tekenInVoorKpOpDatum,
  tekenInVoorMoment,
  tekenUitVoorMoment,
} from '@/util/kookploeg';
import dayjs, { Dayjs } from 'dayjs';
import { revalidatePath } from 'next/cache';

export async function removeKok(moment_id: number, kookploeg_id: KookploegId) {
  await removeKokFromKookploegMoment(moment_id);
  revalidateKookploeg(kookploeg_id);
}

export async function addKok(
  moment_id: number,
  gebruiker_id: number,
  kookploeg_id: KookploegId
) {
  await setKokForKookploegMoment(moment_id, gebruiker_id);
  revalidateKookploeg(kookploeg_id);
}

export async function intekenen(
  moment_id: number,
  gebruiker_id: number,
  kookploeg_id: KookploegId
) {
  await tekenInVoorMoment(moment_id, gebruiker_id);
  revalidateKookploeg(kookploeg_id);
}

export async function startMoment(
  gebruiker_id: number,
  kookploeg_id: KookploegId,
  datum: string
) {
  await tekenInVoorKpOpDatum(gebruiker_id, kookploeg_id, dayjs(datum));
  revalidateKookploeg(kookploeg_id);
}

export async function uittekenen(
  moment_id: number,
  gebruiker_id: number,
  kookploeg_id: KookploegId
) {
  await tekenUitVoorMoment(moment_id, gebruiker_id);
  revalidateKookploeg(kookploeg_id);
}

export const revalidateKookploeg = async (kookploeg_id: KookploegId) => {
  revalidatePath('');
  revalidatePath(`kookploeg/${kookploeg_id}`);
};
