package cm.vetchi.service;

import cm.vetchi.domain.Organisation;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Organisation}.
 */
public interface OrganisationService {
    /**
     * Save a organisation.
     *
     * @param organisation the entity to save.
     * @return the persisted entity.
     */
    Organisation save(Organisation organisation);

    /**
     * Updates a organisation.
     *
     * @param organisation the entity to update.
     * @return the persisted entity.
     */
    Organisation update(Organisation organisation);

    /**
     * Partially updates a organisation.
     *
     * @param organisation the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Organisation> partialUpdate(Organisation organisation);

    /**
     * Get all the organisations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Organisation> findAll(Pageable pageable);

    /**
     * Get all the organisations with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Organisation> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" organisation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Organisation> findOne(Long id);

    /**
     * Delete the "id" organisation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
