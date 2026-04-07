import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeUsername(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function safeString(value) {
  return String(value ?? "");
}

function pickUserProfile(formRows, username, warnings) {
  const matches = formRows.filter(
    (row) => normalizeUsername(row.user) === username
  );

  if (matches.length > 1) {
    warnings.push(
      `Multiple userForm rows found for username "${username}" (${matches.length}); using first row.`
    );
  }

  if (matches.length === 0) {
    return {
      firstname: "",
      surname: "",
      profileBio: "",
      profileFavoriteAuthors: "",
      profileFavoriteGenres: "",
      profileFavoriteBook: ""
    };
  }

  const profile = matches[0];
  return {
    firstname: safeString(profile.firstname),
    surname: safeString(profile.surname),
    profileBio: safeString(profile.profileBio),
    profileFavoriteAuthors: safeString(profile.profileFavoriteAuthors),
    profileFavoriteGenres: safeString(profile.profileFavoriteGenres),
    profileFavoriteBook: safeString(profile.profileFavoriteBook)
  };
}

async function loadLegacyDatabase() {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const databasePath = path.resolve(currentDir, "../../src/database.json");
  const raw = await readFile(databasePath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const warnings = [];
  const summary = {
    prompts: 0,
    users: 0,
    texts: 0,
    likes: 0
  };

  const database = await loadLegacyDatabase();
  const randomPrompts = asArray(database.randomPrompts);
  const userInfo = asArray(database.userInfo);
  const userForm = asArray(database.userForm);
  const publishedTexts = asArray(database.publishedTexts);

  const userInfoByUsername = new Map();
  for (const account of userInfo) {
    const username = normalizeUsername(account.username);
    if (!username) {
      warnings.push("Skipping userInfo row with empty username.");
      continue;
    }

    if (userInfoByUsername.has(username)) {
      warnings.push(
        `Duplicate username in userInfo: "${username}". Keeping first row.`
      );
      continue;
    }

    userInfoByUsername.set(username, account);
  }

  for (const formRow of userForm) {
    const formUsername = normalizeUsername(formRow.user);
    if (!formUsername) {
      warnings.push("Found userForm row with empty user field.");
      continue;
    }

    if (!userInfoByUsername.has(formUsername)) {
      warnings.push(
        `Orphan userForm row for username "${formUsername}" (no matching userInfo).`
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.like.deleteMany();
    await tx.publishedText.deleteMany();
    await tx.prompt.deleteMany();
    await tx.user.deleteMany();

    console.log(`Seeding ${randomPrompts.length} prompts...`);
    const promptRows = randomPrompts
      .map((entry) => ({ text: safeString(entry.prompt).trim() }))
      .filter((entry) => entry.text.length > 0);

    if (promptRows.length > 0) {
      const createdPrompts = await tx.prompt.createMany({
        data: promptRows,
        skipDuplicates: true
      });
      summary.prompts = createdPrompts.count;
    }

    console.log(`Seeding ${userInfoByUsername.size} users...`);
    const usersByUsername = new Map();
    for (const [username, account] of userInfoByUsername.entries()) {
      const passwordPlain = safeString(account.password);
      const passwordHash = await bcrypt.hash(passwordPlain, BCRYPT_ROUNDS);
      const profile = pickUserProfile(userForm, username, warnings);

      const createdUser = await tx.user.create({
        data: {
          username,
          passwordHash,
          ...profile
        }
      });

      usersByUsername.set(username, createdUser);
      summary.users += 1;
    }

    console.log(`Seeding ${publishedTexts.length} published texts...`);
    const textIdBySourceId = new Map();
    for (const legacyText of publishedTexts) {
      const authorUsername = normalizeUsername(legacyText.name);
      const author = usersByUsername.get(authorUsername);

      if (!author) {
        warnings.push(
          `Skipping published text "${safeString(legacyText.id)}": author "${authorUsername}" not found.`
        );
        continue;
      }

      const createdText = await tx.publishedText.create({
        data: {
          authorId: author.id,
          prompt: safeString(legacyText.prompt),
          text: safeString(legacyText.text),
          date: safeString(legacyText.date)
        }
      });

      textIdBySourceId.set(safeString(legacyText.id), createdText.id);
      summary.texts += 1;
    }

    const likeRows = [];
    for (const legacyText of publishedTexts) {
      const sourceTextId = safeString(legacyText.id);
      const publishedTextId = textIdBySourceId.get(sourceTextId);
      if (!publishedTextId) {
        continue;
      }

      const likesList = asArray(legacyText.likesList);
      for (const likedBy of likesList) {
        const likedByUsername = normalizeUsername(likedBy);
        const user = usersByUsername.get(likedByUsername);

        if (!user) {
          warnings.push(
            `Skipping like for text "${sourceTextId}": user "${likedByUsername}" not found.`
          );
          continue;
        }

        likeRows.push({
          userId: user.id,
          publishedTextId
        });
      }
    }

    console.log(`Seeding ${likeRows.length} likes...`);
    if (likeRows.length > 0) {
      const createdLikes = await tx.like.createMany({
        data: likeRows,
        skipDuplicates: true
      });
      summary.likes = createdLikes.count;
    }
  });

  console.log("Seeding complete.");
  console.log(
    `Summary: prompts=${summary.prompts}, users=${summary.users}, texts=${summary.texts}, likes=${summary.likes}`
  );

  if (warnings.length > 0) {
    console.warn(`Warnings (${warnings.length}):`);
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
