# mini-crm

React + Firebase Firestore mini CRM gyakorloprojekt.

## Funkciok
- Ugyfel felvetele (nev, email, telefon, ceg, megjegyzes)
- Mentes Firestore adatbazisba
- Ugyfel lista valos ideju betoltese (`onSnapshot`)
- Feature-first mappastruktura
- Kikulonitett alap style system (tokenek + komponensosztalyok)

## Projekt struktura
- `src/app`: app shell es oldal-szintu osszerakas
- `src/features/customers`: ugyfel feature (API, hook, komponensek, page, model)
- `src/lib/firebase`: Firebase inicializalas
- `src/style-system`: boss-fele alap stilusrendszer

## Lokalis inditas
1. Hozd letre a `.env` fajlt a `.env.example` alapjan.
2. Toltsd ki a Firebase Web App kulcsokat.
3. Telepites es futtatas:

```bash
npm install
npm run dev
```

## Firebase beallitas
- Hozz letre egy Firebase projektet.
- Engedelyezd a Firestore Database-t.
- A Firestore-ban hasznalt collection neve: `customers`.

## Git szimulacio (AI-first workflow gyakorlashoz)
1. `main` branch: csak az alap app (ez a "fonoktol kapott" bazis).
2. Torlod lokalisan az appot (vagy uj klon).
3. Ujra klonozod a repot es innen dolgozol tovabb.
4. Uj igenyre kulon branch:

```bash
git checkout -b feat/customer-filter
```

5. Kisebb, ertelmes commitokkal haladj (pl. `feat(customers): add search by company`).
6. Pull requestben dokumentald: problema, megoldas, teszteles.
