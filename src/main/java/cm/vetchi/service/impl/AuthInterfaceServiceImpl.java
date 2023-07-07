package cm.vetchi.service.impl;

import cm.vetchi.domain.AuthInterface;
import cm.vetchi.repository.AuthInterfaceRepository;
import cm.vetchi.service.AuthInterfaceService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link AuthInterface}.
 */
@Service
@Transactional
public class AuthInterfaceServiceImpl implements AuthInterfaceService {

    private final Logger log = LoggerFactory.getLogger(AuthInterfaceServiceImpl.class);

    private final AuthInterfaceRepository authInterfaceRepository;

    public AuthInterfaceServiceImpl(AuthInterfaceRepository authInterfaceRepository) {
        this.authInterfaceRepository = authInterfaceRepository;
    }

    @Override
    public AuthInterface save(AuthInterface authInterface) {
        log.debug("Request to save AuthInterface : {}", authInterface);
        return authInterfaceRepository.save(authInterface);
    }

    @Override
    public AuthInterface update(AuthInterface authInterface) {
        log.debug("Request to save AuthInterface : {}", authInterface);
        return authInterfaceRepository.save(authInterface);
    }

    @Override
    public Optional<AuthInterface> partialUpdate(AuthInterface authInterface) {
        log.debug("Request to partially update AuthInterface : {}", authInterface);

        return authInterfaceRepository
            .findById(authInterface.getId())
            .map(existingAuthInterface -> {
                if (authInterface.getName() != null) {
                    existingAuthInterface.setName(authInterface.getName());
                }
                if (authInterface.getDescription() != null) {
                    existingAuthInterface.setDescription(authInterface.getDescription());
                }
                if (authInterface.getUrl() != null) {
                    existingAuthInterface.setUrl(authInterface.getUrl());
                }
                if (authInterface.getDriverName() != null) {
                    existingAuthInterface.setDriverName(authInterface.getDriverName());
                }

                return existingAuthInterface;
            })
            .map(authInterfaceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuthInterface> findAll(Pageable pageable) {
        log.debug("Request to get all AuthInterfaces");
        return authInterfaceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AuthInterface> findOne(Long id) {
        log.debug("Request to get AuthInterface : {}", id);
        return authInterfaceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete AuthInterface : {}", id);
        authInterfaceRepository.deleteById(id);
    }
}
