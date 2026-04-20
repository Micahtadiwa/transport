export const ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  ATTENDANT: "Attendant",
  DRIVER: "Driver",
};

const ROLE_ALIASES = {
  "upper admin": ROLES.ADMIN,
  "system admin": ROLES.ADMIN,
  admin: ROLES.ADMIN,
  manager: ROLES.MANAGER,
  attendant: ROLES.ATTENDANT,
  driver: ROLES.DRIVER,
};

export const normalizeRole = (role) => {
  if (!role || typeof role !== "string") return "";
  return ROLE_ALIASES[role.trim().toLowerCase()] || role.trim();
};

export const getUserRole = (user) => {
  const rawRole = user?.Role || user?.role || user?.userRole || "";
  return normalizeRole(rawRole);
};

export const hasRequiredRole = (userRole, allowedRoles = []) => {
  if (!allowedRoles?.length) return true;
  const normalizedRole = normalizeRole(userRole);
  return allowedRoles.includes(normalizedRole);
};
