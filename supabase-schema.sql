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
  phone text not null,
  date_of_birth date,
  enrollment_date date not null,
  entry_result text,
  exit_target text,
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  parent_id uuid references public.parents(id) on delete set null,
  address text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Entry test candidates table (pre-enrollment)
create table public.entry_test_candidate (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text not null,
  date_of_birth date,
  test_date date not null default current_date,
  entry_result text not null,
  recommended_level text check (recommended_level in ('beginner', 'elementary', 'pre-intermediate', 'intermediate', 'upper-intermediate', 'advanced', 'proficient')),
  decision_status text not null default 'pending' check (decision_status in ('pending', 'accepted', 'rejected')),
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
create index idx_parents_email on public.parents(email);
create index idx_entry_test_candidate_test_date on public.entry_test_candidate(test_date);
create index idx_entry_test_candidate_decision_status on public.entry_test_candidate(decision_status);

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

create trigger set_entry_test_candidate_updated_at
  before update on public.entry_test_candidate
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
alter table public.entry_test_candidate enable row level security;

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

create policy "Enable all access for authenticated users" on public.entry_test_candidate
  for all using (auth.role() = 'authenticated');

-- =============================================
-- Classes table
-- =============================================
create table public.classes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  class_type text not null default 'communication-english' check (class_type in ('ielts', 'communication-english')),
  level text not null check (
    (class_type = 'communication-english' and level in ('beginner', 'elementary', 'pre-intermediate', 'intermediate', 'upper-intermediate'))
    or
    (class_type = 'ielts' and level in ('pre-ielts', '3.5-4.5', '4.5-5.5', '5.5-6.5', '6.5-7.0+'))
  ),
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Class-student junction table
create table public.class_students (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  enrolled_at timestamp with time zone default now(),
  primary key (class_id, student_id)
);

-- Class-teacher assignment table
create table public.class_teacher_assignments (
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete restrict,
  role text not null check (role in ('main-teacher', 'teaching-assistant')),
  created_at timestamp with time zone default now(),
  primary key (class_id, teacher_id, role),
  unique (class_id, teacher_id)
);

-- Lessons table
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  class_id uuid not null references public.classes(id) on delete cascade,
  title text not null,
  content text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'ongoing', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Lesson attendance table
create table public.lesson_attendance (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status text not null default 'present' check (status in ('present', 'late', 'absent_excused', 'absent_unexcused')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (lesson_id, student_id)
);

-- Indexes
create index idx_classes_status on public.classes(status);
create index idx_classes_level on public.classes(level);
create index idx_class_students_class_id on public.class_students(class_id);
create index idx_class_students_student_id on public.class_students(student_id);
create index idx_class_teacher_assignments_class_id on public.class_teacher_assignments(class_id);
create index idx_class_teacher_assignments_teacher_id on public.class_teacher_assignments(teacher_id);
create index idx_class_teacher_assignments_role on public.class_teacher_assignments(role);
create index idx_lessons_class_id on public.lessons(class_id);
create index idx_lessons_status on public.lessons(status);
create index idx_lessons_start_time on public.lessons(start_time);
create index idx_lesson_attendance_lesson_id on public.lesson_attendance(lesson_id);
create index idx_lesson_attendance_student_id on public.lesson_attendance(student_id);

-- Updated_at triggers
create trigger set_classes_updated_at
  before update on public.classes
  for each row execute procedure public.handle_updated_at();

create trigger set_lessons_updated_at
  before update on public.lessons
  for each row execute procedure public.handle_updated_at();

create trigger set_lesson_attendance_updated_at
  before update on public.lesson_attendance
  for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.classes enable row level security;
alter table public.class_students enable row level security;
alter table public.class_teacher_assignments enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_attendance enable row level security;

create policy "Enable all access for authenticated users" on public.classes
  for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.class_students
  for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.class_teacher_assignments
  for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.lessons
  for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.lesson_attendance
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- Authentication: User Roles
-- ============================================================
-- Links Supabase Auth users to their application role.
-- Admin accounts are created manually via Supabase dashboard.
-- Teacher accounts are linked to a teacher record via teacher_id.

create table public.user_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('admin', 'teacher')),
  teacher_id uuid references public.teacher(id) on delete set null,
  created_at timestamp with time zone default now()
);

alter table public.user_roles enable row level security;

-- Users can only read their own role
create policy "Users can read own role"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- Only service role can insert/update roles (no client-side self-assignment)
-- To create the first admin, run this in the Supabase SQL editor after
-- creating the user in Authentication > Users:
--
--   insert into public.user_roles (user_id, role)
--   values ('<paste-user-uuid-here>', 'admin');
--
-- To link a teacher account:
--   insert into public.user_roles (user_id, role, teacher_id)
--   values ('<user-uuid>', 'teacher', '<teacher-table-uuid>');

-- ============================================================
-- Authentication: Helper functions
-- ============================================================

create or replace function public.auth_user_exists(email_input text)
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists(
    select 1
    from auth.users u
    where lower(u.email) = lower(email_input)
  );
$$;

grant execute on function public.auth_user_exists(text) to anon, authenticated;

