package cm.vetchi.service;

import cm.vetchi.domain.InterfaceParam;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link InterfaceParam}.
 */
public interface InterfaceParamService {
    /**
     * Save a interfaceParam.
     *
     * @param interfaceParam the entity to save.
     * @return the persisted entity.
     */
    InterfaceParam save(InterfaceParam interfaceParam);

    /**
     * Updates a interfaceParam.
     *
     * @param interfaceParam the entity to update.
     * @return the persisted entity.
     */
    InterfaceParam update(InterfaceParam interfaceParam);

    /**
     * Partially updates a interfaceParam.
     *
     * @param interfaceParam the entity to update partially.
     * @return the persisted entity.
     */
    Optional<InterfaceParam> partialUpdate(InterfaceParam interfaceParam);

    /**
     * Get all the interfaceParams.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<InterfaceParam> findAll(Pageable pageable);

    /**
     * Get the "id" interfaceParam.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<InterfaceParam> findOne(Long id);

    /**
     * Delete the "id" interfaceParam.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
