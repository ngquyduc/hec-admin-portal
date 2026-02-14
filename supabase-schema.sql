-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Staff table
create table public.staff (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text not null,
  role text not null check (role in ('administrator', 'coordinator', 'receptionist', 'accountant', 'manager')),
  hire_date date not null,
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  address text,
  emergency_contact text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Teachers table
create table public.teachers (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text not null,
  subjects text[] not null,
  qualifications text not null,
  hire_date date not null,
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  hourly_rate numeric(10, 2),
  address text,
  emergency_contact text,
  bio text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Parents table
create table public.parents (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text not null,
  relationship text not null check (relationship in ('mother', 'father', 'guardian', 'grandmother', 'grandfather', 'other')),
  student_ids text[] default '{}',
  address text,
  occupation text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Students table
create table public.students (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  date_of_birth date not null,
  enrollment_date date not null,
  level text not null check (level in ('beginner', 'elementary', 'pre-intermediate', 'intermediate', 'upper-intermediate', 'advanced', 'proficient')),
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  parent_id uuid references public.parents(id) on delete set null,
  address text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for better query performance
create index idx_staff_status on public.staff(status);
create index idx_staff_role on public.staff(role);
create index idx_teachers_status on public.teachers(status);
create index idx_students_status on public.students(status);
create index idx_students_parent_id on public.students(parent_id);
create index idx_students_level on public.students(level);
create index idx_parents_email on public.parents(email);

-- Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_staff_updated_at
  before update on public.staff
  for each row
  execute procedure public.handle_updated_at();

create trigger set_teachers_updated_at
  before update on public.teachers
  for each row
  execute procedure public.handle_updated_at();

create trigger set_students_updated_at
  before update on public.students
  for each row
  execute procedure public.handle_updated_at();

create trigger set_parents_updated_at
  before update on public.parents
  for each row
  execute procedure public.handle_updated_at();

-- Row Level Security (RLS)
alter table public.staff enable row level security;
alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.parents enable row level security;

-- Policies (adjust based on your auth requirements)
-- For now, allow authenticated users to do everything
create policy "Enable all access for authenticated users" on public.staff
  for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.teachers
  for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.students
  for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.parents
  for all using (auth.role() = 'authenticated');
