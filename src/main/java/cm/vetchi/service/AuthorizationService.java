package cm.vetchi.service;

import cm.vetchi.domain.Authorization;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Authorization}.
 */
public interface AuthorizationService {
    /**
     * Save a authorization.
     *
     * @param authorization the entity to save.
     * @return the persisted entity.
     */
    Authorization save(Authorization authorization);

    /**
     * Updates a authorization.
     *
     * @param authorization the entity to update.
     * @return the persisted entity.
     */
    Authorization update(Authorization authorization);

    /**
     * Partially updates a authorization.
     *
     * @param authorization the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Authorization> partialUpdate(Authorization authorization);

    /**
     * Get all the authorizations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Authorization> findAll(Pageable pageable);

    /**
     * Get the "id" authorization.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Authorization> findOne(Long id);

    /**
     * Delete the "id" authorization.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
