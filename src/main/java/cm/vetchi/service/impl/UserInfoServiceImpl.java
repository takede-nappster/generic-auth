package cm.vetchi.service.impl;

import cm.vetchi.domain.UserInfo;
import cm.vetchi.repository.UserInfoRepository;
import cm.vetchi.service.UserInfoService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link UserInfo}.
 */
@Service
@Transactional
public class UserInfoServiceImpl implements UserInfoService {

    private final Logger log = LoggerFactory.getLogger(UserInfoServiceImpl.class);

    private final UserInfoRepository userInfoRepository;

    public UserInfoServiceImpl(UserInfoRepository userInfoRepository) {
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    public UserInfo save(UserInfo userInfo) {
        log.debug("Request to save UserInfo : {}", userInfo);
        return userInfoRepository.save(userInfo);
    }

    @Override
    public UserInfo update(UserInfo userInfo) {
        log.debug("Request to save UserInfo : {}", userInfo);
        return userInfoRepository.save(userInfo);
    }

    @Override
    public Optional<UserInfo> partialUpdate(UserInfo userInfo) {
        log.debug("Request to partially update UserInfo : {}", userInfo);

        return userInfoRepository
            .findById(userInfo.getId())
            .map(existingUserInfo -> {
                if (userInfo.getFirstName() != null) {
                    existingUserInfo.setFirstName(userInfo.getFirstName());
                }
                if (userInfo.getLastName() != null) {
                    existingUserInfo.setLastName(userInfo.getLastName());
                }
                if (userInfo.getUsername() != null) {
                    existingUserInfo.setUsername(userInfo.getUsername());
                }
                if (userInfo.getImagebiometric() != null) {
                    existingUserInfo.setImagebiometric(userInfo.getImagebiometric());
                }
                if (userInfo.getDateOfBirth() != null) {
                    existingUserInfo.setDateOfBirth(userInfo.getDateOfBirth());
                }
                if (userInfo.getUserType() != null) {
                    existingUserInfo.setUserType(userInfo.getUserType());
                }

                return existingUserInfo;
            })
            .map(userInfoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserInfo> findAll(Pageable pageable) {
        log.debug("Request to get all UserInfos");
        return userInfoRepository.findAll(pageable);
    }

    public Page<UserInfo> findAllWithEagerRelationships(Pageable pageable) {
        return userInfoRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserInfo> findOne(Long id) {
        log.debug("Request to get UserInfo : {}", id);
        return userInfoRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete UserInfo : {}", id);
        userInfoRepository.deleteById(id);
    }
}
