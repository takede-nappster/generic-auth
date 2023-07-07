package cm.vetchi.service;

import cm.vetchi.domain.Role;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Role}.
 */
public interface RoleService {
    /**
     * Save a role.
     *
     * @param role the entity to save.
     * @return the persisted entity.
     */
    Role save(Role role);

    /**
     * Updates a role.
     *
     * @param role the entity to update.
     * @return the persisted entity.
     */
    Role update(Role role);

    /**
     * Partially updates a role.
     *
     * @param role the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Role> partialUpdate(Role role);

    /**
     * Get all the roles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Role> findAll(Pageable pageable);

    /**
     * Get the "id" role.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Role> findOne(Long id);

    /**
     * Delete the "id" role.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
