package cm.vetchi.service;

import cm.vetchi.domain.Groupe;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Groupe}.
 */
public interface GroupeService {
    /**
     * Save a groupe.
     *
     * @param groupe the entity to save.
     * @return the persisted entity.
     */
    Groupe save(Groupe groupe);

    /**
     * Updates a groupe.
     *
     * @param groupe the entity to update.
     * @return the persisted entity.
     */
    Groupe update(Groupe groupe);

    /**
     * Partially updates a groupe.
     *
     * @param groupe the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Groupe> partialUpdate(Groupe groupe);

    /**
     * Get all the groupes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Groupe> findAll(Pageable pageable);

    /**
     * Get the "id" groupe.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Groupe> findOne(Long id);

    /**
     * Delete the "id" groupe.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
