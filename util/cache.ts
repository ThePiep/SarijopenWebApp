import { bewoners } from '@/models/bewoners';
import { kookploeg_eters } from '@/models/kookploeg_eters';
import { kookploeg_gebruikers } from '@/models/kookploeg_gebruikers';
import { kookploeg_momenten } from '@/models/kookploeg_momenten';
import { uitspraken } from '@/models/uitspraken';
import { accessCache } from 'next-build-cache';
import { ChatGPTArtikelType } from './chatGPT';

export const bewonersCache = accessCache<bewoners[]>('build.cache');

export const kookploegGebruikersCache =
  accessCache<kookploeg_gebruikers[]>('build.cache');

export const kookploegMomentenCache =
  accessCache<kookploeg_momenten[]>('build.cache');

export const kookploegEters = accessCache<kookploeg_eters[]>('build.cache');

export const citatenCache = accessCache<uitspraken[]>('build.cache');

export const chatGPTArtikelCache = accessCache<string>('build.cache');
