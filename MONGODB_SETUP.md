# MongoDB setup

The admin panel (`/admin`) saves Poojas and Reports through `/api/content/[key]`.
That API uses **MongoDB when `MONGODB_URI` is set**, and a local JSON file
(`data/`) otherwise. Follow either option below.

You only need to set two environment variables in a file called **`.env.local`**
at the project root:

```
MONGODB_URI=...your connection string...
MONGODB_DB=rahulraj
```

(There is an `.env.example` you can copy.)

---

## Option A — MongoDB Atlas (free cloud, recommended)

Works from anywhere, no install. ~5 minutes.

1. Go to **https://www.mongodb.com/atlas** and create a free account.
2. **Create a cluster** → choose the **free M0** tier → pick a region → *Create*.
3. **Create a database user**: Atlas → *Database Access* → *Add New Database User*
   → set a username + password (remember them) → *Add User*.
4. **Allow network access**: Atlas → *Network Access* → *Add IP Address* →
   for testing click **"Allow access from anywhere" (0.0.0.0/0)** → *Confirm*.
   (For production, restrict this to your server's IP.)
5. **Get the connection string**: Atlas → *Database* → *Connect* → *Drivers* →
   copy the string. It looks like:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. In the project root create **`.env.local`**:
   ```
   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=rahulraj
   ```
   Replace `USER` and `PASSWORD` with the user you created. If your password has
   special characters, URL-encode them (e.g. `@` → `%40`).
7. Restart the app: `npm run build` then `npm run start` (or `npm run dev`).

Done — edits in `/admin` now save to your Atlas database.

---

## Option B — Local MongoDB (on your PC)

1. Install **MongoDB Community Server**: https://www.mongodb.com/try/download/community
   (on Windows, the installer can also install it as a service that runs
   automatically). Or run it via Docker:
   ```
   docker run -d -p 27017:27017 --name mongo mongo:7
   ```
2. Create **`.env.local`**:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017
   MONGODB_DB=rahulraj
   ```
3. Restart the app.

---

## How the data is stored

- One MongoDB collection named **`content`** in your database.
- One document per content type: `{ _id: "poojas", items: [...] }` and
  `{ _id: "reports", items: [...] }`.
- The admin **Reset demo** button deletes that document, so the next load shows
  the built-in defaults again.

## Verify it's connected

After setting `.env.local` and restarting, open the admin, edit a pooja, then in
your MongoDB tool (Atlas UI or Compass) open database **`rahulraj`** → collection
**`content`** → you'll see the `poojas` document update.

## Troubleshooting

**"unable to verify the first certificate" / saves hang then fail**
This is a **TLS** problem, usually caused by antivirus or firewall software on
your PC inspecting HTTPS traffic and presenting a certificate Node can't verify.
For **local development**, add this line to `.env.local`:
```
MONGODB_TLS_INSECURE=true
```
This relaxes certificate checking so the connection succeeds. **Do not set it on
a production server** — there's no TLS inspection there, so the real certificate
verifies normally. (A cleaner local alternative on Node 22+ is to start with
`node --use-system-ca`, or set `NODE_EXTRA_CA_CERTS` to your AV's root CA.)

**Connection just times out (~8s) with a network error**
Atlas → **Network Access** isn't allowing your IP. Add your IP (or `0.0.0.0/0`
for testing).

**Authentication failed**
Wrong username/password in the URI, or the password isn't URL-encoded
(`@`→`%40`, `#`→`%23`, etc.). Reset it under Atlas → *Database Access*.

## Notes

- Keep `.env.local` private — never commit it. (`.gitignore` already excludes it.)
- No `MONGODB_URI` set? The app still works using the local `data/*.json` files,
  so nothing breaks before you finish the MongoDB setup.
