package cm.vetchi.service;

import cm.vetchi.domain.OrganisationService;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrganisationService}.
 */
public interface OrganisationServiceService {
    /**
     * Save a organisationService.
     *
     * @param organisationService the entity to save.
     * @return the persisted entity.
     */
    OrganisationService save(OrganisationService organisationService);

    /**
     * Updates a organisationService.
     *
     * @param organisationService the entity to update.
     * @return the persisted entity.
     */
    OrganisationService update(OrganisationService organisationService);

    /**
     * Partially updates a organisationService.
     *
     * @param organisationService the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OrganisationService> partialUpdate(OrganisationService organisationService);

    /**
     * Get all the organisationServices.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<OrganisationService> findAll(Pageable pageable);

    /**
     * Get all the organisationServices with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<OrganisationService> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" organisationService.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OrganisationService> findOne(Long id);

    /**
     * Delete the "id" organisationService.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
