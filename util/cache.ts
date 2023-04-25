import { bewoners } from "@/models/bewoners";
import { uitspraken } from "@/models/uitspraken";
import { accessCache } from "next-build-cache";

export const bewonersCache = accessCache<bewoners[]>("build.cache");

export const citatenCache = accessCache<uitspraken[]>("build.cache");
