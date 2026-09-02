// Clinical Ledger: frontend affordances mirror—never replace—Laravel authorization.
export function usePermissions(user) {
  const granted = user?.permissions?.map((permission) => permission.slug) || [];
  const isSuperAdmin = user?.role?.slug === 'super-admin';

  return {
    can: (permission) => isSuperAdmin || granted.includes(permission),
  };
}
