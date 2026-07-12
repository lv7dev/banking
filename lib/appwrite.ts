"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const endpoint = getRequiredEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT");
const project = getRequiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT");
const apiKey = getRequiredEnv("NEXT_APPWRITE_KEY");

export async function createSessionClient() {
  const client = new Client().setEndpoint(endpoint).setProject(project);

  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(apiKey);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
  };
}
