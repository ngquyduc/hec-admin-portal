


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."auth_user_exists"("email_input" "text") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
  select exists(
    select 1
    from auth.users u
    where lower(u.email) = lower(email_input)
  );
$$;


ALTER FUNCTION "public"."auth_user_exists"("email_input" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."assessment_component_scores" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "component_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "score" numeric(5,2),
    "feedback" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."assessment_component_scores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."assessment_components" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "assessment_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "is_scorable" boolean DEFAULT true NOT NULL,
    "max_score" numeric(5,2),
    "display_order" integer DEFAULT 0 NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "assessment_components_score_shape_check" CHECK (((("is_scorable" = true) AND ("max_score" IS NOT NULL) AND ("max_score" > (0)::numeric)) OR (("is_scorable" = false) AND ("max_score" IS NULL))))
);


ALTER TABLE "public"."assessment_components" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."assessment_scores" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "assessment_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "score" numeric(6,2),
    "feedback" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "assessment_scores_score_check" CHECK ((("score" IS NULL) OR ("score" >= (0)::numeric)))
);


ALTER TABLE "public"."assessment_scores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."assessments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "class_id" "uuid" NOT NULL,
    "lesson_id" "uuid",
    "type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "max_score" numeric(6,2) DEFAULT 10 NOT NULL,
    "weight" numeric(6,2) DEFAULT 1 NOT NULL,
    "assigned_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "due_at" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "assessments_max_score_check" CHECK (("max_score" > (0)::numeric)),
    CONSTRAINT "assessments_type_check" CHECK (("type" = ANY (ARRAY['in-class'::"text", 'homework'::"text", 'test'::"text"]))),
    CONSTRAINT "assessments_weight_check" CHECK (("weight" > (0)::numeric))
);


ALTER TABLE "public"."assessments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."class_students" (
    "class_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "enrolled_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."class_students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."class_teacher_assignments" (
    "class_id" "uuid" NOT NULL,
    "teacher_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "class_teacher_assignments_role_check" CHECK (("role" = ANY (ARRAY['main-teacher'::"text", 'teaching-assistant'::"text"])))
);


ALTER TABLE "public"."class_teacher_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."classes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "level" "text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "class_type" "text" DEFAULT 'communication-english'::"text" NOT NULL,
    CONSTRAINT "classes_class_type_check" CHECK (("class_type" = ANY (ARRAY['ielts'::"text", 'communication-english'::"text"]))),
    CONSTRAINT "classes_level_class_type_check" CHECK (((("class_type" = 'communication-english'::"text") AND ("level" = ANY (ARRAY['beginner'::"text", 'elementary'::"text", 'pre-intermediate'::"text", 'intermediate'::"text", 'upper-intermediate'::"text"]))) OR (("class_type" = 'ielts'::"text") AND ("level" = ANY (ARRAY['pre-ielts'::"text", '3.5-4.5'::"text", '4.5-5.5'::"text", '5.5-6.5'::"text", '6.5-7.0+'::"text"]))))),
    CONSTRAINT "classes_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'suspended'::"text"])))
);


ALTER TABLE "public"."classes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."entry_test_candidate" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text",
    "phone" "text" NOT NULL,
    "date_of_birth" "date",
    "test_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "entry_result" "text" NOT NULL,
    "recommended_level" "text",
    "decision_status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "entry_test_candidate_decision_status_check" CHECK (("decision_status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'rejected'::"text"]))),
    CONSTRAINT "entry_test_candidate_recommended_level_check" CHECK (("recommended_level" = ANY (ARRAY['beginner'::"text", 'elementary'::"text", 'pre-intermediate'::"text", 'intermediate'::"text", 'upper-intermediate'::"text", 'advanced'::"text", 'proficient'::"text"])))
);


ALTER TABLE "public"."entry_test_candidate" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "user_role" "text" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "feedback_user_role_check" CHECK (("user_role" = ANY (ARRAY['admin'::"text", 'teacher'::"text"])))
);


ALTER TABLE "public"."feedback" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lesson_attendance" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "lesson_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'present'::"text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "lesson_attendance_status_check" CHECK (("status" = ANY (ARRAY['present'::"text", 'late'::"text", 'absent_excused'::"text", 'absent_unexcused'::"text"])))
);


ALTER TABLE "public"."lesson_attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lessons" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "class_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text",
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'scheduled'::"text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "lessons_status_check" CHECK (("status" = ANY (ARRAY['scheduled'::"text", 'ongoing'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."lessons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."parent" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" "text",
    "phone" "text" NOT NULL,
    "relationship" "text",
    "student_ids" "uuid"[] DEFAULT '{}'::"uuid"[] NOT NULL,
    "address" "text",
    "occupation" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL,
    CONSTRAINT "parent_relationship_check" CHECK (("relationship" = ANY (ARRAY['mother'::"text", 'father'::"text", 'guardian'::"text", 'grandmother'::"text", 'grandfather'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."parent" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."staff" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "role" "text" NOT NULL,
    "hire_date" timestamp with time zone,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "address" "text",
    "emergency_contact" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL,
    CONSTRAINT "staff_role_check" CHECK (("role" = ANY (ARRAY['administrator'::"text", 'coordinator'::"text", 'receptionist'::"text", 'accountant'::"text", 'manager'::"text"]))),
    CONSTRAINT "staff_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'suspended'::"text"])))
);


ALTER TABLE "public"."staff" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."students" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" "text",
    "phone" "text",
    "date_of_birth" timestamp with time zone,
    "enrollment_date" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "parent_id" "uuid",
    "address" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL,
    "entry_result" "text",
    "exit_target" "text",
    CONSTRAINT "student_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'suspended'::"text"])))
);


ALTER TABLE "public"."students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teacher" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "phone" "text" DEFAULT ''::"text" NOT NULL,
    "subjects" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "hire_date" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "address" "text",
    "emergency_contact" "text",
    "notes" "text",
    "role" "text" DEFAULT 'main-teacher'::"text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "teacher_role_check" CHECK (("role" = ANY (ARRAY['main-teacher'::"text", 'teaching-assistant'::"text"])))
);


ALTER TABLE "public"."teacher" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "teacher_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_roles_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'teacher'::"text"])))
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."assessment_component_scores"
    ADD CONSTRAINT "assessment_component_scores_component_id_student_id_key" UNIQUE ("component_id", "student_id");



ALTER TABLE ONLY "public"."assessment_component_scores"
    ADD CONSTRAINT "assessment_component_scores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessment_components"
    ADD CONSTRAINT "assessment_components_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessment_scores"
    ADD CONSTRAINT "assessment_scores_assessment_id_student_id_key" UNIQUE ("assessment_id", "student_id");



ALTER TABLE ONLY "public"."assessment_scores"
    ADD CONSTRAINT "assessment_scores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessments"
    ADD CONSTRAINT "assessments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."class_students"
    ADD CONSTRAINT "class_students_pkey" PRIMARY KEY ("class_id", "student_id");



ALTER TABLE ONLY "public"."class_teacher_assignments"
    ADD CONSTRAINT "class_teacher_assignments_class_id_teacher_id_key" UNIQUE ("class_id", "teacher_id");



ALTER TABLE ONLY "public"."class_teacher_assignments"
    ADD CONSTRAINT "class_teacher_assignments_pkey" PRIMARY KEY ("class_id", "teacher_id", "role");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."entry_test_candidate"
    ADD CONSTRAINT "entry_test_candidate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lesson_attendance"
    ADD CONSTRAINT "lesson_attendance_lesson_id_student_id_key" UNIQUE ("lesson_id", "student_id");



ALTER TABLE ONLY "public"."lesson_attendance"
    ADD CONSTRAINT "lesson_attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."parent"
    ADD CONSTRAINT "parent_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."staff"
    ADD CONSTRAINT "staff_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "student_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teacher"
    ADD CONSTRAINT "teacher_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."teacher"
    ADD CONSTRAINT "teacher_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id");



CREATE INDEX "assessment_scores_assessment_id_idx" ON "public"."assessment_scores" USING "btree" ("assessment_id");



CREATE INDEX "assessment_scores_student_id_idx" ON "public"."assessment_scores" USING "btree" ("student_id");



CREATE INDEX "assessments_class_id_idx" ON "public"."assessments" USING "btree" ("class_id");



CREATE INDEX "assessments_lesson_id_idx" ON "public"."assessments" USING "btree" ("lesson_id");



CREATE INDEX "assessments_type_idx" ON "public"."assessments" USING "btree" ("type");



CREATE UNIQUE INDEX "assessments_unique_lesson_type_idx" ON "public"."assessments" USING "btree" ("class_id", "lesson_id", "type") WHERE ("lesson_id" IS NOT NULL);



CREATE INDEX "idx_assessment_component_scores_component_id" ON "public"."assessment_component_scores" USING "btree" ("component_id");



CREATE INDEX "idx_assessment_component_scores_student_id" ON "public"."assessment_component_scores" USING "btree" ("student_id");



CREATE INDEX "idx_assessment_components_assessment_id" ON "public"."assessment_components" USING "btree" ("assessment_id");



CREATE INDEX "idx_class_students_class_id" ON "public"."class_students" USING "btree" ("class_id");



CREATE INDEX "idx_class_students_student_id" ON "public"."class_students" USING "btree" ("student_id");



CREATE INDEX "idx_class_teacher_assignments_class_id" ON "public"."class_teacher_assignments" USING "btree" ("class_id");



CREATE INDEX "idx_class_teacher_assignments_role" ON "public"."class_teacher_assignments" USING "btree" ("role");



CREATE INDEX "idx_class_teacher_assignments_teacher_id" ON "public"."class_teacher_assignments" USING "btree" ("teacher_id");



CREATE INDEX "idx_classes_level" ON "public"."classes" USING "btree" ("level");



CREATE INDEX "idx_classes_status" ON "public"."classes" USING "btree" ("status");



CREATE INDEX "idx_entry_test_candidate_decision_status" ON "public"."entry_test_candidate" USING "btree" ("decision_status");



CREATE INDEX "idx_entry_test_candidate_test_date" ON "public"."entry_test_candidate" USING "btree" ("test_date");



CREATE INDEX "idx_feedback_created_at" ON "public"."feedback" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_feedback_user_id" ON "public"."feedback" USING "btree" ("user_id");



CREATE INDEX "idx_lesson_attendance_lesson_id" ON "public"."lesson_attendance" USING "btree" ("lesson_id");



CREATE INDEX "idx_lesson_attendance_student_id" ON "public"."lesson_attendance" USING "btree" ("student_id");



CREATE INDEX "idx_lessons_class_id" ON "public"."lessons" USING "btree" ("class_id");



CREATE INDEX "idx_lessons_start_time" ON "public"."lessons" USING "btree" ("start_time");



CREATE INDEX "idx_lessons_status" ON "public"."lessons" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "set_classes_updated_at" BEFORE UPDATE ON "public"."classes" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_entry_test_candidate_updated_at" BEFORE UPDATE ON "public"."entry_test_candidate" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_lesson_attendance_updated_at" BEFORE UPDATE ON "public"."lesson_attendance" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_lessons_updated_at" BEFORE UPDATE ON "public"."lessons" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



ALTER TABLE ONLY "public"."assessment_component_scores"
    ADD CONSTRAINT "assessment_component_scores_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "public"."assessment_components"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessment_component_scores"
    ADD CONSTRAINT "assessment_component_scores_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessment_components"
    ADD CONSTRAINT "assessment_components_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessment_scores"
    ADD CONSTRAINT "assessment_scores_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessment_scores"
    ADD CONSTRAINT "assessment_scores_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessments"
    ADD CONSTRAINT "assessments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessments"
    ADD CONSTRAINT "assessments_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."class_students"
    ADD CONSTRAINT "class_students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_students"
    ADD CONSTRAINT "class_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_teacher_assignments"
    ADD CONSTRAINT "class_teacher_assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_teacher_assignments"
    ADD CONSTRAINT "class_teacher_assignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lesson_attendance"
    ADD CONSTRAINT "lesson_attendance_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lesson_attendance"
    ADD CONSTRAINT "lesson_attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "student_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parent"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Enable all access" ON "public"."class_students" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all access" ON "public"."classes" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all access" ON "public"."lesson_attendance" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all access" ON "public"."lessons" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all access for authenticated users" ON "public"."class_teacher_assignments" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable all access for authenticated users" ON "public"."entry_test_candidate" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can insert own feedback" ON "public"."feedback" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Users can read own feedback" ON "public"."feedback" FOR SELECT USING ((("auth"."role"() = 'authenticated'::"text") AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Users can read own role" ON "public"."user_roles" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."class_students" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."class_teacher_assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."classes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."entry_test_candidate" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feedback" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lesson_attendance" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."auth_user_exists"("email_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."auth_user_exists"("email_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."auth_user_exists"("email_input" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."assessment_component_scores" TO "anon";
GRANT ALL ON TABLE "public"."assessment_component_scores" TO "authenticated";
GRANT ALL ON TABLE "public"."assessment_component_scores" TO "service_role";



GRANT ALL ON TABLE "public"."assessment_components" TO "anon";
GRANT ALL ON TABLE "public"."assessment_components" TO "authenticated";
GRANT ALL ON TABLE "public"."assessment_components" TO "service_role";



GRANT ALL ON TABLE "public"."assessment_scores" TO "anon";
GRANT ALL ON TABLE "public"."assessment_scores" TO "authenticated";
GRANT ALL ON TABLE "public"."assessment_scores" TO "service_role";



GRANT ALL ON TABLE "public"."assessments" TO "anon";
GRANT ALL ON TABLE "public"."assessments" TO "authenticated";
GRANT ALL ON TABLE "public"."assessments" TO "service_role";



GRANT ALL ON TABLE "public"."class_students" TO "anon";
GRANT ALL ON TABLE "public"."class_students" TO "authenticated";
GRANT ALL ON TABLE "public"."class_students" TO "service_role";



GRANT ALL ON TABLE "public"."class_teacher_assignments" TO "anon";
GRANT ALL ON TABLE "public"."class_teacher_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."class_teacher_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."classes" TO "anon";
GRANT ALL ON TABLE "public"."classes" TO "authenticated";
GRANT ALL ON TABLE "public"."classes" TO "service_role";



GRANT ALL ON TABLE "public"."entry_test_candidate" TO "anon";
GRANT ALL ON TABLE "public"."entry_test_candidate" TO "authenticated";
GRANT ALL ON TABLE "public"."entry_test_candidate" TO "service_role";



GRANT ALL ON TABLE "public"."feedback" TO "anon";
GRANT ALL ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";



GRANT ALL ON TABLE "public"."lesson_attendance" TO "anon";
GRANT ALL ON TABLE "public"."lesson_attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."lesson_attendance" TO "service_role";



GRANT ALL ON TABLE "public"."lessons" TO "anon";
GRANT ALL ON TABLE "public"."lessons" TO "authenticated";
GRANT ALL ON TABLE "public"."lessons" TO "service_role";



GRANT ALL ON TABLE "public"."parent" TO "anon";
GRANT ALL ON TABLE "public"."parent" TO "authenticated";
GRANT ALL ON TABLE "public"."parent" TO "service_role";



GRANT ALL ON TABLE "public"."staff" TO "anon";
GRANT ALL ON TABLE "public"."staff" TO "authenticated";
GRANT ALL ON TABLE "public"."staff" TO "service_role";



GRANT ALL ON TABLE "public"."students" TO "anon";
GRANT ALL ON TABLE "public"."students" TO "authenticated";
GRANT ALL ON TABLE "public"."students" TO "service_role";



GRANT ALL ON TABLE "public"."teacher" TO "anon";
GRANT ALL ON TABLE "public"."teacher" TO "authenticated";
GRANT ALL ON TABLE "public"."teacher" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


