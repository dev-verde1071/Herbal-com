export async function isAdmin() {
  return true;
}

export async function syncUser() {
  return null;
}

export async function getCurrentDbUser() {
  return {
    email: "admin@herbalcommunities.com",
  };
}
