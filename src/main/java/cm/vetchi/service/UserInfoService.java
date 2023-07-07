package cm.vetchi.service;

import cm.vetchi.domain.UserInfo;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link UserInfo}.
 */
public interface UserInfoService {
    /**
     * Save a userInfo.
     *
     * @param userInfo the entity to save.
     * @return the persisted entity.
     */
    UserInfo save(UserInfo userInfo);

    /**
     * Updates a userInfo.
     *
     * @param userInfo the entity to update.
     * @return the persisted entity.
     */
    UserInfo update(UserInfo userInfo);

    /**
     * Partially updates a userInfo.
     *
     * @param userInfo the entity to update partially.
     * @return the persisted entity.
     */
    Optional<UserInfo> partialUpdate(UserInfo userInfo);

    /**
     * Get all the userInfos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserInfo> findAll(Pageable pageable);

    /**
     * Get all the userInfos with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserInfo> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" userInfo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserInfo> findOne(Long id);

    /**
     * Delete the "id" userInfo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
