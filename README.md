This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## De app runnen voor lokale ontwikkeling

Installeer eerst de dependencies:

```
npm install
```

Genereer dan de [sequelize](https://github.com/sequelize/sequelize-auto) models met de volgende command:

```
sequelize-auto -o "./models" -d [db_name] -h [host] -u [username] -p [port] -x [password] -e mysql
```

LET OP: De database bevat tabel namen die niet geldig zijn als js var/functie naam. Verwijder deze handmatig uit models/init-models.ts .

Run de app als volgt:

```
npm run start
```

De app runt nu op [http://localhost:3000](http://localhost:3000)

## Server toegang en rechten

Om te kunnen connecten met de MySql DBMS op de server moet je ip adress gewitlist zijn. Hiervoor heb je iig een statisch ip nodig. Vraag je lokale webmaster (of Mu bij gebrek aan kennis) om hulp.
Daarnaast is het belangrijk om alle ontwikkeling te doen tegen de development database. Als die niet meer bestaat of te ver achterloopt copieer die dan vanaf de Sarijopen database.

## Belangrijke dependencies

- [Tailwind]() - css framework
- [DaisyUI]() - UI component styles gebaseert op Tailwind. Gebruik minimaal, handig je even snel een nieuw ui element nodig hebt.
- [Sequelize]() - Query typesafe met stijl naar de database, verstaat ook gewoon mooi ouderwetse queries.
- [DayJS]() - Alles wat met dates te maken heeft.
- [ReactHookForm]() Library om makkelijker om te gaan met forms, gebruik niet verplicht.
- [Yup]() Schema definities te gebruiken om zowel api input als forms te valideren. Gebruik is niet verplicht, validatie op andere manieren is prima.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
