import sequelize from "@/lib/sequelize";
import { uitspraken } from "@/models/uitspraken";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getToken({ req });
  console.log("session", session);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  uitspraken.initModel(sequelize);
  const obj: uitspraken = await req.json();
  console.log("json", obj);

  if (
    obj.uitspraak === "" ||
    (obj.bewonerID === 0 && obj.gast === "") ||
    (obj.bewonerID !== 0 && obj.gast !== "") ||
    (obj.tegenbewonerID !== 0 && obj.tegengast !== "")
  ) {
    return new Response("Error: Incorrect input", { status: 400 });
  }
  const now = dayjs();
  const uitspraak = await uitspraken.create({
    ...obj,
    datum: now.format("YYYY-MM-DD"),
    tijd: now.format("HH:mm:ss"),
  });

  return new Response("Success");
}
