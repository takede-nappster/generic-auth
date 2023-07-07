package cm.vetchi.service;

import cm.vetchi.domain.Bundle;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Bundle}.
 */
public interface BundleService {
    /**
     * Save a bundle.
     *
     * @param bundle the entity to save.
     * @return the persisted entity.
     */
    Bundle save(Bundle bundle);

    /**
     * Updates a bundle.
     *
     * @param bundle the entity to update.
     * @return the persisted entity.
     */
    Bundle update(Bundle bundle);

    /**
     * Partially updates a bundle.
     *
     * @param bundle the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Bundle> partialUpdate(Bundle bundle);

    /**
     * Get all the bundles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Bundle> findAll(Pageable pageable);

    /**
     * Get the "id" bundle.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Bundle> findOne(Long id);

    /**
     * Delete the "id" bundle.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
