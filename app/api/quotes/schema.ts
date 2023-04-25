import { isNil } from "lodash";
import { number, object, string } from "yup";

export const nieuweUitspraakSchema = object().shape(
  {
    bewonerID: number().when("gast", {
      is: (gast: string) => isNil(gast),
      then: (schema) =>
        number()
          .positive()
          .required(
            "Hoor je weer stemmen in je hoofd? Vul hier a.u.b. wie de uitspraak gedaan heeft."
          ),
      otherwise: (schema) =>
        number().test("bewonerID", "Bewoner is niet correct", (value) =>
          isNil(value)
        ),
    }),
    gast: string().when("bewonerID", {
      is: (bewonerID: number) => isNil(bewonerID),
      then: (schema) =>
        string().required(
          "Als je een gast wilt invullen moet die wel een naam hebben..."
        ),
      otherwise: (schema) =>
        string().test("gast", "Gast is niet correct", (value) => isNil(value)),
    }),
    tegenbewonerID: number().when("tegengast", {
      is: (tegengast: string) => isNil(tegengast),
      then: (schema) => number().positive(),
      otherwise: (schema) =>
        number().test("bewonerID", "Bewoner is niet correct", (value) =>
          isNil(value)
        ),
    }),
    tegengast: string().when("tegenbewonerID", {
      is: (tegenbewonerID: number) => isNil(tegenbewonerID),
      then: (schema) => string(),
      otherwise: (schema) =>
        string().test("gast", "Gast is niet correct", (value) => isNil(value)),
    }),
    uitspraak: string().required(
      "Aan een lege uitspraak hebben we natuurlijk niks."
    ),
  },
  [
    ["bewonerID", "gast"],
    ["tegenbewonerID", "tegengast"],
  ]
);
