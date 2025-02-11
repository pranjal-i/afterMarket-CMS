import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '@/access/anyone'
import { userCreatePublic } from '@/access/anyUserCreate'
import { RoleNames } from '@/constants'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: userCreatePublic,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'password',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Editor',
          value: RoleNames.Editor,
        },
        {
          label: 'Reviewer',
          value: RoleNames.Reviewer,
        },
        {
          label: 'Admin',
          value: RoleNames.Admin,
        },
        {
          label: 'Superadmin',
          value: RoleNames.SuperAdmin,
        },
      ],
      defaultValue: RoleNames.Editor,
      required: true,
    }
  ],
  timestamps: true,
}
