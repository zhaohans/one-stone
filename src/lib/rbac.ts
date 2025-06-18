import { UserRole } from '../types';

type Permission = 'read' | 'write' | 'delete' | 'admin';

interface RolePermissions {
  [key: string]: Permission[];
}

const rolePermissions: RolePermissions = {
  user: ['read'],
  moderator: ['read', 'write'],
  admin: ['read', 'write', 'delete', 'admin'],
};

export const hasPermission = (userRole: UserRole, requiredPermission: Permission): boolean => {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(requiredPermission);
};

export const requirePermission = (requiredPermission: Permission) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.user?.role || 'user';
    
    if (!hasPermission(userRole, requiredPermission)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to perform this action',
      });
    }
    
    next();
  };
};

export const requireRole = (requiredRole: UserRole) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.user?.role || 'user';
    
    if (userRole !== requiredRole) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have the required role to perform this action',
      });
    }
    
    next();
  };
}; 