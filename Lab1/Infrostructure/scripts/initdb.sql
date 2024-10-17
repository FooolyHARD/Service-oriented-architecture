create table coordinates
(
    coordinates_uuid UUID PRIMARY KEY,
    x bigint,
    y int
);

create table persons
(
    person_uuid UUID PRIMARY KEY,
    birthday DATE,
    passport_uuid UUID,
    hairColor TEXT,
    nationality TEXT
);

create table locations
(
    location_uuid UUID PRIMARY KEY,
    x bigint,
    y float,
    z float,
    name TEXT
);

create table users
(
    user_uuid UUID PRIMARY KEY,
    name TEXT,
    coordinates UUID REFERENCES coordinates (coordinates_uuid),
    creationTime DATE,
    salary int,
    startDate DATE,
    status TEXT,
    person UUID REFERENCES persons (person_uuid)
);

