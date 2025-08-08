-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.brand_images (
  id integer NOT NULL DEFAULT nextval('brand_images_id_seq'::regclass),
  brand_id integer NOT NULL,
  url text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT brand_images_pkey PRIMARY KEY (id),
  CONSTRAINT brand_images_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
);
CREATE TABLE public.brands (
  id integer NOT NULL DEFAULT nextval('brands_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT brands_pkey PRIMARY KEY (id)
);
CREATE TABLE public.color_products (
  product_id integer NOT NULL,
  color_hex_code character varying NOT NULL,
  CONSTRAINT color_products_pkey PRIMARY KEY (product_id, color_hex_code),
  CONSTRAINT color_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT color_products_color_hex_code_fkey FOREIGN KEY (color_hex_code) REFERENCES public.colors(hex_code)
);
CREATE TABLE public.colors (
  hex_code character varying NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT colors_pkey PRIMARY KEY (hex_code)
);
CREATE TABLE public.inventory_current (
  product_id integer NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT inventory_current_pkey PRIMARY KEY (product_id),
  CONSTRAINT inventory_current_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.inventory_movements (
  id integer NOT NULL DEFAULT nextval('inventory_movements_id_seq'::regclass),
  product_id integer NOT NULL,
  movement_type character varying NOT NULL CHECK (movement_type::text = ANY (ARRAY['IN'::character varying, 'OUT'::character varying]::text[])),
  quantity integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT inventory_movements_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.product_images (
  id integer NOT NULL DEFAULT nextval('product_images_id_seq'::regclass),
  product_id integer NOT NULL,
  url text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.product_types (
  id integer NOT NULL DEFAULT nextval('product_types_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT product_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.products (
  id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  product_type_id integer NOT NULL,
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  price numeric NOT NULL,
  original_price numeric,
  sale_price numeric,
  original_url character varying UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  brand_id integer,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES public.brands(id),
  CONSTRAINT products_product_type_id_fkey FOREIGN KEY (product_type_id) REFERENCES public.product_types(id)
);