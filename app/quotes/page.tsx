import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/nl";
import { uitspraken } from "@/models/uitspraken";
import { bewoners } from "@/models/bewoners";
import sequelize from "@/lib/sequelize";
import { initModels } from "@/models/init-models";
import { UitspraakForm } from "@/components/UitspraakForm";
dayjs.extend(updateLocale);
dayjs.locale("nl");

dayjs.extend(relativeTime);

export async function getQuotes() {
  initModels(sequelize);
  const obj = await uitspraken.findAll({
    limit: 10,
    order: [["id", "desc"]],
  });

  const bew = new Map<number, string>();

  for (const u of obj) {
    if (u.bewonerID !== 0 && !bew.has(u.bewonerID)) {
      const b = await bewoners.findByPk(u.bewonerID, { attributes: ["naam"] });
      if (b !== null) {
        bew.set(u.bewonerID, b.naam);
      }
    }
    if (u.tegenbewonerID !== 0 && !bew.has(u.tegenbewonerID)) {
      const b = await bewoners.findByPk(u.tegenbewonerID, {
        attributes: ["naam"],
      });
      if (b !== null) {
        bew.set(u.tegenbewonerID, b.naam);
      }
    }
  }
  return { obj, bew };
}

export default async function Quotes() {
  const { obj, bew } = await getQuotes();

  return (
    <>
      <UitspraakForm bs={Array.from(bew)}>
        {obj.map((u, index) => {
          const auteur = u.gast.length
            ? u.gast
            : bew.get(u.bewonerID) ?? u.bewonerID;
          const ontvanger = u.tegengast.length
            ? u.tegengast
            : bew.get(u.tegenbewonerID) ?? undefined;
          const tijd = dayjs(`${u.datum} ${u.tijd}`);
          return (
            <div key={index} className="chat chat-start mb-1">
              <div className="chat-header">
                {`${auteur} ${ontvanger ? `tegen ${ontvanger}` : ""}  `}
                <div
                  className="tooltip tooltip-right "
                  data-tip={tijd.format("DD/MM/YYYY HH:mm")}
                >
                  <time className="text-cs opacity-50">{tijd.fromNow()}</time>
                </div>
              </div>
              <div className="chat-bubble">{u.uitspraak}</div>
            </div>
          );
        })}
      </UitspraakForm>
    </>
  );
}
