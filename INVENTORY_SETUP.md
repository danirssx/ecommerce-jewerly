# Inventory System Setup

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project dashboard: https://supabase.com/dashboard

# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Features

✅ **Product Listing Page** (`/inventario`)

- Displays all products in a responsive grid
- Shows product images, names, codes, brands, types, prices, and stock levels
- Handles sale prices and discounts
- Links to individual product pages

✅ **Individual Product Page** (`/inventario/[id]`)

- Detailed product information
- Image gallery with multiple images
- Color variations display
- Inventory status
- Brand and product type information
- Price history (original, sale, current)
- Creation and update timestamps

✅ **Database Integration**

- Connected to Supabase with proper type safety
- Fetches related data (brands, product types, images, colors, inventory)
- Optimized queries with selected fields

## File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── types/
│   └── database.ts          # TypeScript interfaces for database
└── app/
    └── inventario/
        ├── layout.tsx       # Layout with header and footer
        ├── page.tsx         # Product listing page
        └── [id]/
            └── page.tsx     # Individual product page
```

## Next Steps

1. Set up your `.env.local` file with your Supabase credentials
2. Make sure your Supabase database has the required tables as defined in `structure_jewerly.sql`
3. Run `npm run dev` to start the development server
4. Navigate to `/inventario` to see your product inventory

## Dependencies

- `@supabase/supabase-js` - Supabase client library
- `next` - Next.js framework
- `tailwindcss` - Styling (already configured)
