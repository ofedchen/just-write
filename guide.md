## New branch Git & GitHub Lathund Grundläggande Git-kommandon

#### Navigera till rätt mapp

- Öppna terminalen och gå till projektmappen:

- cd /sökväg/till/mappen

#### Initiera ett Git-repository

- Om det är ett nytt projekt:

- `git init`

#### Lägga till filer i staging

- Lägg till alla ändringar:

- `git add .`

- Lägg till en specifik fil:

- `git add filnamn.txt`

#### Spara ändringar (commit)

- `git commit -m "Beskrivning av ändringen"`

- Arbeta med GitHub

- Koppla ihop ditt lokala repo med GitHub

#### Skapa en fjärranslutning till GitHub:

- `git remote add origin https://github.com/rhz1994/hello-world.git`

#### Ställ in huvudgrenen till main och ladda upp första gången:

`git branch -M main`
`git push -u origin main`

#### Hämta senaste ändringar från GitHub

- `git pull origin main`

#### Klona ett GitHub-repository

Om du vill ladda ner en befintlig repo:

`git clone https://github.com/rhz1994/hello-world.git`

#### .gitignore

Skapa en .gitignore-fil för att ignorera filer som inte ska laddas upp (exempel: node_modules, env-filer):

`touch .gitignore`

Lägg sedan till filer och mappar i .gitignore:

node_modules/
.env
.DS_Store

## Branches & Merge

Skapa en ny branch

git checkout -b htmledit

Sedan gör du dina ändringar som vanligt och commitar dem.

Avslutar med push för att lägga till ändringarna i github\*

Slå ihop en branch med main

    Växla tillbaka till main: git checkout main


    Slå ihop ändringarna: git merge htmledit

    push


    Ta bort den gamla branchen (valfritt): git branch -d htmledit

Git remote

    git push origin htmledit: Detta kommando skickar den lokala htmledit-branchen till GitHub (eller vilken remote du än använder). Om htmledit inte finns på GitHub än, skapas den där.

    git fetch origin: Detta kommando hämtar alla uppdateringar från den remote repository du arbetar med (i detta fall origin), men det slår inte ihop dem med din lokala branch än. Det gör att du får den senaste informationen om vad som finns på servern.

    git checkout -b htmledit origin/htmledit: Om du har hämtat en branch från GitHub (eller en annan remote), kan du skapa en lokal branch och koppla den till den remote branchen med det här kommandot. Det betyder att du gör en ny lokal branch (htmledit) baserad på den remote versionen av htmledit.

Det är en vanlig arbetsflöde när man samarbetar på ett projekt där flera personer jobbar med olika branches på GitHub!
