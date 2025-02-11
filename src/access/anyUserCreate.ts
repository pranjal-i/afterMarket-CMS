import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => Promise<boolean>

export const userCreatePublic: isAuthenticated = async({ req }) => {

    const { user } = req;
    if (!user) {
        return false;
    }
    
    let body;
    if (req.body) {
        body = req.json ? await req.json() : undefined;
        if (body?.role && body.role === 'superadmin') {
            return false;
        }
    }

    // Allow creation if the logged user has the role 'admin' or 'superadmin'
    const allowedRoles = ['admin', 'superadmin'];
    return allowedRoles.includes(user.role);
};