import sequelize from "@/lib/sequelize";
import { uitspraken } from "@/models/uitspraken";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { nieuweUitspraakSchema } from "./schema";

export async function POST(req: NextRequest) {
  const session = await getToken({ req });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  uitspraken.initModel(sequelize);
  const obj: uitspraken = await req.json();
  const validated = await nieuweUitspraakSchema.validate(obj);

  if (!validated) {
    return new Response("Incorrect input", { status: 400 });
  }

  const now = dayjs();
  const uitspraak = await uitspraken.create({
    ...obj,
    bewonerID: validated.bewonerID ?? 0,
    gast: validated.gast ?? "",
    tegenbewonerID: validated.tegenbewonerID ?? 0,
    tegengast: validated.tegengast ?? "",
    datum: now.format("YYYY-MM-DD"),
    tijd: now.format("HH:mm:ss"),
  });

  return new Response("Success");
}
