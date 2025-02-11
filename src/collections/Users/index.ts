import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '@/access/anyone'
import { userCreatePublic } from '@/access/anyUserCreate'

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
          value: 'editor',
        },
        {
          label: 'Reviewer',
          value: 'reviewer',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Superadmin',
          value: 'superadmin',
        },
      ],
      defaultValue: 'editor',
      required: true,
    }
  ],
  timestamps: true,
}
