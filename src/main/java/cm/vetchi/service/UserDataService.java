package cm.vetchi.service;

import cm.vetchi.domain.UserData;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link UserData}.
 */
public interface UserDataService {
    /**
     * Save a userData.
     *
     * @param userData the entity to save.
     * @return the persisted entity.
     */
    UserData save(UserData userData);

    /**
     * Updates a userData.
     *
     * @param userData the entity to update.
     * @return the persisted entity.
     */
    UserData update(UserData userData);

    /**
     * Partially updates a userData.
     *
     * @param userData the entity to update partially.
     * @return the persisted entity.
     */
    Optional<UserData> partialUpdate(UserData userData);

    /**
     * Get all the userData.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserData> findAll(Pageable pageable);

    /**
     * Get the "id" userData.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserData> findOne(Long id);

    /**
     * Delete the "id" userData.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
