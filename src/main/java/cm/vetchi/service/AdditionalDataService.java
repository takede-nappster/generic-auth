package cm.vetchi.service;

import cm.vetchi.domain.AdditionalData;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link AdditionalData}.
 */
public interface AdditionalDataService {
    /**
     * Save a additionalData.
     *
     * @param additionalData the entity to save.
     * @return the persisted entity.
     */
    AdditionalData save(AdditionalData additionalData);

    /**
     * Updates a additionalData.
     *
     * @param additionalData the entity to update.
     * @return the persisted entity.
     */
    AdditionalData update(AdditionalData additionalData);

    /**
     * Partially updates a additionalData.
     *
     * @param additionalData the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AdditionalData> partialUpdate(AdditionalData additionalData);

    /**
     * Get all the additionalData.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AdditionalData> findAll(Pageable pageable);

    /**
     * Get the "id" additionalData.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AdditionalData> findOne(Long id);

    /**
     * Delete the "id" additionalData.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
