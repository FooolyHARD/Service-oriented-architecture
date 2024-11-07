package com.soa.workerservice.repository.Impl;

import com.soa.workerservice.model.Coordinates;
import com.soa.workerservice.model.Person;
import com.soa.workerservice.model.Worker;
import com.soa.workerservice.repository.WorkerCustomRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.hibernate.boot.query.NamedNativeQueryDefinitionBuilder;
import org.hibernate.query.NativeQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public class WorkerCustomRepositoryImpl implements WorkerCustomRepository{
    @Autowired
    private EntityManager entityManager;

    @Override
    @Transactional
    public <T> void updateWorkerFieldById(UUID id, String field, T value) {
        if (!isValidField(field)) {
            throw new IllegalArgumentException("Invalid field: " + field);
        }

        String jpql = "UPDATE Worker w SET w." + field + " = :value WHERE w.id = :id";
        Query query = entityManager.createQuery(jpql);
        query.setParameter("value", value);
        query.setParameter("id", id);

        query.executeUpdate();
    }

    @Override
    @Transactional
    @Modifying
    public UUID createWorker(Worker worker) {
        Coordinates coord = worker.getCoordinates();
        UUID coord_id = null;
        if (coord != null) coord_id = coord.getId();
        Person pers = worker.getPerson();
        UUID pers_id = null;
        if (pers != null) pers_id = pers.getId();
        UUID id = UUID.randomUUID();
        final String QUERY = "INSERT INTO worker (id, name, coordinates_id, creation_date, salary, start_date, status, position, person_id) VALUES (:id, :name, :coordinates," +
                                                        ":creationDate, :salary, " +
                                                        ":startDate, " +
                                                        ":status, :position, " +
                                                        ":person)";

        Query query = entityManager.createNativeQuery(QUERY);
        query.setParameter("id", id);
        query.setParameter("name", worker.getName());
        query.setParameter("coordinates", coord_id);
        query.setParameter("startDate", worker.getStartDate());
        query.setParameter("salary", worker.getSalary());
        query.setParameter("creationDate", worker.getCreationDate());
        query.setParameter("status", worker.getStatus());
        query.setParameter("position", worker.getPosition());
        query.setParameter("person", pers_id);

        query.executeUpdate();
        return id;
    }


    private boolean isValidField(String field) {
        return true;
    }

    @Override
    public <S extends Worker> S save(S entity) {
        return null;
    }

    @Override
    public <S extends Worker> Iterable<S> saveAll(Iterable<S> entities) {
        return null;
    }

    @Override
    public Optional<Worker> findById(UUID uuid) {
        return Optional.empty();
    }

    @Override
    public boolean existsById(UUID uuid) {
        return false;
    }

    @Override
    public Iterable<Worker> findAll() {
        return null;
    }

    @Override
    public Iterable<Worker> findAllById(Iterable<UUID> uuids) {
        return null;
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public void deleteById(UUID uuid) {

    }

    @Override
    public void delete(Worker entity) {

    }

    @Override
    public void deleteAllById(Iterable<? extends UUID> uuids) {

    }

    @Override
    public void deleteAll(Iterable<? extends Worker> entities) {

    }

    @Override
    public void deleteAll() {

    }
}