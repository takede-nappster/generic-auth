package cm.vetchi.service.impl;

import cm.vetchi.domain.Bundle;
import cm.vetchi.repository.BundleRepository;
import cm.vetchi.service.BundleService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Bundle}.
 */
@Service
@Transactional
public class BundleServiceImpl implements BundleService {

    private final Logger log = LoggerFactory.getLogger(BundleServiceImpl.class);

    private final BundleRepository bundleRepository;

    public BundleServiceImpl(BundleRepository bundleRepository) {
        this.bundleRepository = bundleRepository;
    }

    @Override
    public Bundle save(Bundle bundle) {
        log.debug("Request to save Bundle : {}", bundle);
        return bundleRepository.save(bundle);
    }

    @Override
    public Bundle update(Bundle bundle) {
        log.debug("Request to save Bundle : {}", bundle);
        return bundleRepository.save(bundle);
    }

    @Override
    public Optional<Bundle> partialUpdate(Bundle bundle) {
        log.debug("Request to partially update Bundle : {}", bundle);

        return bundleRepository
            .findById(bundle.getId())
            .map(existingBundle -> {
                if (bundle.getStartDate() != null) {
                    existingBundle.setStartDate(bundle.getStartDate());
                }
                if (bundle.getEndDate() != null) {
                    existingBundle.setEndDate(bundle.getEndDate());
                }

                return existingBundle;
            })
            .map(bundleRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Bundle> findAll(Pageable pageable) {
        log.debug("Request to get all Bundles");
        return bundleRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Bundle> findOne(Long id) {
        log.debug("Request to get Bundle : {}", id);
        return bundleRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Bundle : {}", id);
        bundleRepository.deleteById(id);
    }
}
