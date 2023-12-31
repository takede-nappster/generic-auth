package cm.vetchi.service.impl;

import cm.vetchi.domain.UserData;
import cm.vetchi.repository.UserDataRepository;
import cm.vetchi.service.UserDataService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link UserData}.
 */
@Service
@Transactional
public class UserDataServiceImpl implements UserDataService {

    private final Logger log = LoggerFactory.getLogger(UserDataServiceImpl.class);

    private final UserDataRepository userDataRepository;

    public UserDataServiceImpl(UserDataRepository userDataRepository) {
        this.userDataRepository = userDataRepository;
    }

    @Override
    public UserData save(UserData userData) {
        log.debug("Request to save UserData : {}", userData);
        return userDataRepository.save(userData);
    }

    @Override
    public UserData update(UserData userData) {
        log.debug("Request to save UserData : {}", userData);
        return userDataRepository.save(userData);
    }

    @Override
    public Optional<UserData> partialUpdate(UserData userData) {
        log.debug("Request to partially update UserData : {}", userData);

        return userDataRepository
            .findById(userData.getId())
            .map(existingUserData -> {
                if (userData.getFieldName() != null) {
                    existingUserData.setFieldName(userData.getFieldName());
                }
                if (userData.getFieldCode() != null) {
                    existingUserData.setFieldCode(userData.getFieldCode());
                }
                if (userData.getRequiredStatus() != null) {
                    existingUserData.setRequiredStatus(userData.getRequiredStatus());
                }
                if (userData.getType() != null) {
                    existingUserData.setType(userData.getType());
                }

                return existingUserData;
            })
            .map(userDataRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserData> findAll(Pageable pageable) {
        log.debug("Request to get all UserData");
        return userDataRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserData> findOne(Long id) {
        log.debug("Request to get UserData : {}", id);
        return userDataRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete UserData : {}", id);
        userDataRepository.deleteById(id);
    }
}
