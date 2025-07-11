-- public.actions definition

-- Drop table

-- DROP TABLE public.actions;

CREATE TABLE public.actions (
	id serial NOT NULL,
	action_text varchar(255) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT actions_action_text_key UNIQUE (action_text),
	CONSTRAINT actions_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger update_updated_at_trigger before
update
    on
    public.actions for each row execute function plpgsql_set_updated_at();
create trigger update_actions_updated_at before
update
    on
    public.actions for each row execute function update_updated_at_column();


-- public.anomalies definition

-- Drop table

-- DROP TABLE public.anomalies;

CREATE TABLE public.anomalies (
	id serial NOT NULL,
	"timestamp" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	machine varchar(255) NOT NULL,
	anomaly_type varchar(50) NOT NULL,
	sensor varchar(255) NOT NULL,
	sound_clip varchar(255) NOT NULL,
    suspected_reason varchar(255) NULL,
    action_required varchar(255) NULL,
    comments varchar(255) NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT anomalies_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger update_updated_at_trigger before
update
    on
    public.anomalies for each row execute function plpgsql_set_updated_at();
create trigger update_anomalies_updated_at before
update
    on
    public.anomalies for each row execute function update_updated_at_column();


-- public.reasons definition

-- Drop table

-- DROP TABLE public.reasons;

CREATE TABLE public.reasons (
	id serial NOT NULL,
	machine varchar(255) NOT NULL,
	reason_text varchar(255) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT reasons_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_reason_machine ON public.reasons USING btree (machine);

-- Table Triggers

create trigger update_updated_at_trigger before
update
    on
    public.reasons for each row execute function plpgsql_set_updated_at();
create trigger update_reasons_updated_at before
update
    on
    public.reasons for each row execute function update_updated_at_column();