package cm.vetchi.service;

import cm.vetchi.domain.AuthInterface;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link AuthInterface}.
 */
public interface AuthInterfaceService {
    /**
     * Save a authInterface.
     *
     * @param authInterface the entity to save.
     * @return the persisted entity.
     */
    AuthInterface save(AuthInterface authInterface);

    /**
     * Updates a authInterface.
     *
     * @param authInterface the entity to update.
     * @return the persisted entity.
     */
    AuthInterface update(AuthInterface authInterface);

    /**
     * Partially updates a authInterface.
     *
     * @param authInterface the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AuthInterface> partialUpdate(AuthInterface authInterface);

    /**
     * Get all the authInterfaces.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AuthInterface> findAll(Pageable pageable);

    /**
     * Get the "id" authInterface.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AuthInterface> findOne(Long id);

    /**
     * Delete the "id" authInterface.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
