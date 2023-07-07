package cm.vetchi.service.impl;

import cm.vetchi.domain.OrganisationService;
import cm.vetchi.repository.OrganisationServiceRepository;
import cm.vetchi.service.OrganisationServiceService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link OrganisationService}.
 */
@Service
@Transactional
public class OrganisationServiceServiceImpl implements OrganisationServiceService {

    private final Logger log = LoggerFactory.getLogger(OrganisationServiceServiceImpl.class);

    private final OrganisationServiceRepository organisationServiceRepository;

    public OrganisationServiceServiceImpl(OrganisationServiceRepository organisationServiceRepository) {
        this.organisationServiceRepository = organisationServiceRepository;
    }

    @Override
    public OrganisationService save(OrganisationService organisationService) {
        log.debug("Request to save OrganisationService : {}", organisationService);
        return organisationServiceRepository.save(organisationService);
    }

    @Override
    public OrganisationService update(OrganisationService organisationService) {
        log.debug("Request to save OrganisationService : {}", organisationService);
        return organisationServiceRepository.save(organisationService);
    }

    @Override
    public Optional<OrganisationService> partialUpdate(OrganisationService organisationService) {
        log.debug("Request to partially update OrganisationService : {}", organisationService);

        return organisationServiceRepository
            .findById(organisationService.getId())
            .map(existingOrganisationService -> {
                if (organisationService.getName() != null) {
                    existingOrganisationService.setName(organisationService.getName());
                }
                if (organisationService.getDescription() != null) {
                    existingOrganisationService.setDescription(organisationService.getDescription());
                }

                return existingOrganisationService;
            })
            .map(organisationServiceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrganisationService> findAll(Pageable pageable) {
        log.debug("Request to get all OrganisationServices");
        return organisationServiceRepository.findAll(pageable);
    }

    public Page<OrganisationService> findAllWithEagerRelationships(Pageable pageable) {
        return organisationServiceRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrganisationService> findOne(Long id) {
        log.debug("Request to get OrganisationService : {}", id);
        return organisationServiceRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete OrganisationService : {}", id);
        organisationServiceRepository.deleteById(id);
    }
}
