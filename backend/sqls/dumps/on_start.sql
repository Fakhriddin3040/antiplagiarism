--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Homebrew)
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: mk
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO mk;

--
-- Name: document_chunks; Type: TABLE; Schema: public; Owner: mk
--

CREATE TABLE public.document_chunks (
    document_id uuid NOT NULL,
    content text NOT NULL,
    idx integer NOT NULL,
    vector public.vector(128),
    size integer NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.document_chunks OWNER TO mk;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: mk
--

CREATE TABLE public.documents (
    author_id uuid NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    text text,
    checked boolean NOT NULL,
    verdict integer,
    idexed_at timestamp without time zone,
    is_indexed boolean,
    checked_at timestamp with time zone,
    file_id uuid NOT NULL,
    folder_id uuid NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    created_by_id uuid NOT NULL
);


ALTER TABLE public.documents OWNER TO mk;

--
-- Name: documents_authors; Type: TABLE; Schema: public; Owner: mk
--

CREATE TABLE public.documents_authors (
    first_name character varying(20) NOT NULL,
    last_name character varying(20) NOT NULL,
    description character varying(255),
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    created_by_id uuid NOT NULL
);


ALTER TABLE public.documents_authors OWNER TO mk;

--
-- Name: files; Type: TABLE; Schema: public; Owner: mk
--

CREATE TABLE public.files (
    title character varying NOT NULL,
    description character varying NOT NULL,
    path character varying NOT NULL,
    extension character varying NOT NULL,
    mimetype character varying NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    created_by_id uuid NOT NULL
);


ALTER TABLE public.files OWNER TO mk;

--
-- Name: folders; Type: TABLE; Schema: public; Owner: mk
--

CREATE TABLE public.folders (
    title character varying(30) NOT NULL,
    description character varying(255) NOT NULL,
    parent_id uuid,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    created_by_id uuid NOT NULL
);


ALTER TABLE public.folders OWNER TO mk;

--
-- Name: plagiarism_checks; Type: TABLE; Schema: public; Owner: mk
--

CREATE TABLE public.plagiarism_checks (
    document_id uuid NOT NULL,
    max_similarity_score double precision NOT NULL,
    status integer NOT NULL,
    verdict integer NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    created_by_id uuid NOT NULL
);


ALTER TABLE public.plagiarism_checks OWNER TO mk;

--
-- Name: plagiarism_matches; Type: TABLE; Schema: public; Owner: mk
--

CREATE TABLE public.plagiarism_matches (
    check_id uuid NOT NULL,
    source_chunk_id uuid NOT NULL,
    matched_chunk_id uuid NOT NULL,
    similarity double precision NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.plagiarism_matches OWNER TO mk;

--
-- Name: users; Type: TABLE; Schema: public; Owner: mk
--

CREATE TABLE public.users (
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(25),
    last_name character varying(25),
    confirmed boolean NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO mk;

--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: mk
--

COPY public.alembic_version (version_num) FROM stdin;
5d2b80d6edf5
\.


--
-- Data for Name: document_chunks; Type: TABLE DATA; Schema: public; Owner: mk
--

COPY public.document_chunks (document_id, content, idx, vector, size, id, created_at) FROM stdin;
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: mk
--

COPY public.documents (author_id, title, description, text, checked, verdict, idexed_at, is_indexed, checked_at, file_id, folder_id, id, created_at, updated_at, created_by_id) FROM stdin;
\.


--
-- Data for Name: documents_authors; Type: TABLE DATA; Schema: public; Owner: mk
--

COPY public.documents_authors (first_name, last_name, description, id, created_at, updated_at, created_by_id) FROM stdin;
string	string	string	9eb25e90-4d71-4e71-9da6-20864e44c999	2025-05-21 14:32:10.881632+05	2025-05-21 14:32:10.881645+05	2209e3fd-7115-4c6b-9570-58c5993d7a0a
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: mk
--

COPY public.files (title, description, path, extension, mimetype, id, created_at, updated_at, created_by_id) FROM stdin;
\.


--
-- Data for Name: folders; Type: TABLE DATA; Schema: public; Owner: mk
--

COPY public.folders (title, description, parent_id, id, created_at, updated_at, created_by_id) FROM stdin;
string	string	\N	a437a454-6670-4409-a814-78c58106659d	2025-05-21 14:32:24.256847+05	2025-05-21 14:32:24.256852+05	2209e3fd-7115-4c6b-9570-58c5993d7a0a
\.


--
-- Data for Name: plagiarism_checks; Type: TABLE DATA; Schema: public; Owner: mk
--

COPY public.plagiarism_checks (document_id, max_similarity_score, status, verdict, id, created_at, created_by_id) FROM stdin;
\.


--
-- Data for Name: plagiarism_matches; Type: TABLE DATA; Schema: public; Owner: mk
--

COPY public.plagiarism_matches (check_id, source_chunk_id, matched_chunk_id, similarity, id, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mk
--

COPY public.users (username, password, email, first_name, last_name, confirmed, id, created_at, updated_at) FROM stdin;
string	$2b$12$Bgij/CP2bGXbfoHjcysWNeDAxg0mqEhDMAyiCCEhtoFFFvWpfI7Ty	f@f.f	string	string	f	2209e3fd-7115-4c6b-9570-58c5993d7a0a	2025-05-21 14:31:43.577789+05	2025-05-21 14:31:43.577793+05
\.


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: document_chunks document_chunks_document_id_idx_key; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.document_chunks
    ADD CONSTRAINT document_chunks_document_id_idx_key UNIQUE (document_id, idx);


--
-- Name: document_chunks document_chunks_pkey; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.document_chunks
    ADD CONSTRAINT document_chunks_pkey PRIMARY KEY (id);


--
-- Name: documents_authors documents_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.documents_authors
    ADD CONSTRAINT documents_authors_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: folders folders_pkey; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_pkey PRIMARY KEY (id);


--
-- Name: plagiarism_checks plagiarism_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.plagiarism_checks
    ADD CONSTRAINT plagiarism_checks_pkey PRIMARY KEY (id);


--
-- Name: plagiarism_matches plagiarism_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.plagiarism_matches
    ADD CONSTRAINT plagiarism_matches_pkey PRIMARY KEY (id);


--
-- Name: documents unique_document_author_title; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT unique_document_author_title UNIQUE (author_id, title);


--
-- Name: documents unique_document_file_id; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT unique_document_file_id UNIQUE (file_id);


--
-- Name: folders uq_folder_title_parent; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT uq_folder_title_parent UNIQUE (title, parent_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: ix_document_chunks_vector; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_document_chunks_vector ON public.document_chunks USING btree (vector);


--
-- Name: ix_documents_author_id; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_documents_author_id ON public.documents USING btree (author_id);


--
-- Name: ix_documents_authors_created_by_id; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_documents_authors_created_by_id ON public.documents_authors USING btree (created_by_id);


--
-- Name: ix_documents_created_by_id; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_documents_created_by_id ON public.documents USING btree (created_by_id);


--
-- Name: ix_documents_folder_id; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_documents_folder_id ON public.documents USING btree (folder_id);


--
-- Name: ix_files_created_by_id; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_files_created_by_id ON public.files USING btree (created_by_id);


--
-- Name: ix_files_title; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_files_title ON public.files USING btree (title);


--
-- Name: ix_folders_created_by_id; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_folders_created_by_id ON public.folders USING btree (created_by_id);


--
-- Name: ix_folders_description; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_folders_description ON public.folders USING btree (description);


--
-- Name: ix_folders_parent_id; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_folders_parent_id ON public.folders USING btree (parent_id);


--
-- Name: ix_folders_title; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_folders_title ON public.folders USING btree (title);


--
-- Name: ix_plagiarism_checks_created_by_id; Type: INDEX; Schema: public; Owner: mk
--

CREATE INDEX ix_plagiarism_checks_created_by_id ON public.plagiarism_checks USING btree (created_by_id);


--
-- Name: document_chunks document_chunks_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.document_chunks
    ADD CONSTRAINT document_chunks_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id);


--
-- Name: documents documents_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.documents_authors(id);


--
-- Name: documents_authors documents_authors_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.documents_authors
    ADD CONSTRAINT documents_authors_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: documents documents_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: documents documents_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id);


--
-- Name: documents documents_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.folders(id);


--
-- Name: files files_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: folders folders_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: folders folders_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.folders(id) ON DELETE CASCADE;


--
-- Name: plagiarism_checks plagiarism_checks_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.plagiarism_checks
    ADD CONSTRAINT plagiarism_checks_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: plagiarism_checks plagiarism_checks_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.plagiarism_checks
    ADD CONSTRAINT plagiarism_checks_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id);


--
-- Name: plagiarism_matches plagiarism_matches_check_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.plagiarism_matches
    ADD CONSTRAINT plagiarism_matches_check_id_fkey FOREIGN KEY (check_id) REFERENCES public.plagiarism_checks(id);


--
-- Name: plagiarism_matches plagiarism_matches_matched_chunk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.plagiarism_matches
    ADD CONSTRAINT plagiarism_matches_matched_chunk_id_fkey FOREIGN KEY (matched_chunk_id) REFERENCES public.document_chunks(id);


--
-- Name: plagiarism_matches plagiarism_matches_source_chunk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mk
--

ALTER TABLE ONLY public.plagiarism_matches
    ADD CONSTRAINT plagiarism_matches_source_chunk_id_fkey FOREIGN KEY (source_chunk_id) REFERENCES public.document_chunks(id);


--
-- PostgreSQL database dump complete
--
