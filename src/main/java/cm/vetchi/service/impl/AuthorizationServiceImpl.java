package cm.vetchi.service.impl;

import cm.vetchi.domain.Authorization;
import cm.vetchi.repository.AuthorizationRepository;
import cm.vetchi.service.AuthorizationService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Authorization}.
 */
@Service
@Transactional
public class AuthorizationServiceImpl implements AuthorizationService {

    private final Logger log = LoggerFactory.getLogger(AuthorizationServiceImpl.class);

    private final AuthorizationRepository authorizationRepository;

    public AuthorizationServiceImpl(AuthorizationRepository authorizationRepository) {
        this.authorizationRepository = authorizationRepository;
    }

    @Override
    public Authorization save(Authorization authorization) {
        log.debug("Request to save Authorization : {}", authorization);
        return authorizationRepository.save(authorization);
    }

    @Override
    public Authorization update(Authorization authorization) {
        log.debug("Request to save Authorization : {}", authorization);
        return authorizationRepository.save(authorization);
    }

    @Override
    public Optional<Authorization> partialUpdate(Authorization authorization) {
        log.debug("Request to partially update Authorization : {}", authorization);

        return authorizationRepository
            .findById(authorization.getId())
            .map(existingAuthorization -> {
                if (authorization.getName() != null) {
                    existingAuthorization.setName(authorization.getName());
                }
                if (authorization.getDescription() != null) {
                    existingAuthorization.setDescription(authorization.getDescription());
                }
                if (authorization.getCode() != null) {
                    existingAuthorization.setCode(authorization.getCode());
                }

                return existingAuthorization;
            })
            .map(authorizationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Authorization> findAll(Pageable pageable) {
        log.debug("Request to get all Authorizations");
        return authorizationRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Authorization> findOne(Long id) {
        log.debug("Request to get Authorization : {}", id);
        return authorizationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Authorization : {}", id);
        authorizationRepository.deleteById(id);
    }
}
