package cm.vetchi.service.impl;

import cm.vetchi.domain.Organisation;
import cm.vetchi.repository.OrganisationRepository;
import cm.vetchi.service.OrganisationService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Organisation}.
 */
@Service
@Transactional
public class OrganisationServiceImpl implements OrganisationService {

    private final Logger log = LoggerFactory.getLogger(OrganisationServiceImpl.class);

    private final OrganisationRepository organisationRepository;

    public OrganisationServiceImpl(OrganisationRepository organisationRepository) {
        this.organisationRepository = organisationRepository;
    }

    @Override
    public Organisation save(Organisation organisation) {
        log.debug("Request to save Organisation : {}", organisation);
        return organisationRepository.save(organisation);
    }

    @Override
    public Organisation update(Organisation organisation) {
        log.debug("Request to save Organisation : {}", organisation);
        return organisationRepository.save(organisation);
    }

    @Override
    public Optional<Organisation> partialUpdate(Organisation organisation) {
        log.debug("Request to partially update Organisation : {}", organisation);

        return organisationRepository
            .findById(organisation.getId())
            .map(existingOrganisation -> {
                if (organisation.getName() != null) {
                    existingOrganisation.setName(organisation.getName());
                }
                if (organisation.getDescription() != null) {
                    existingOrganisation.setDescription(organisation.getDescription());
                }
                if (organisation.getEmail() != null) {
                    existingOrganisation.setEmail(organisation.getEmail());
                }
                if (organisation.getPassword() != null) {
                    existingOrganisation.setPassword(organisation.getPassword());
                }
                if (organisation.getToken() != null) {
                    existingOrganisation.setToken(organisation.getToken());
                }

                return existingOrganisation;
            })
            .map(organisationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Organisation> findAll(Pageable pageable) {
        log.debug("Request to get all Organisations");
        return organisationRepository.findAll(pageable);
    }

    public Page<Organisation> findAllWithEagerRelationships(Pageable pageable) {
        return organisationRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Organisation> findOne(Long id) {
        log.debug("Request to get Organisation : {}", id);
        return organisationRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Organisation : {}", id);
        organisationRepository.deleteById(id);
    }
}
