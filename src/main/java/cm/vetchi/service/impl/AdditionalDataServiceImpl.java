package cm.vetchi.service.impl;

import cm.vetchi.domain.AdditionalData;
import cm.vetchi.repository.AdditionalDataRepository;
import cm.vetchi.service.AdditionalDataService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link AdditionalData}.
 */
@Service
@Transactional
public class AdditionalDataServiceImpl implements AdditionalDataService {

    private final Logger log = LoggerFactory.getLogger(AdditionalDataServiceImpl.class);

    private final AdditionalDataRepository additionalDataRepository;

    public AdditionalDataServiceImpl(AdditionalDataRepository additionalDataRepository) {
        this.additionalDataRepository = additionalDataRepository;
    }

    @Override
    public AdditionalData save(AdditionalData additionalData) {
        log.debug("Request to save AdditionalData : {}", additionalData);
        return additionalDataRepository.save(additionalData);
    }

    @Override
    public AdditionalData update(AdditionalData additionalData) {
        log.debug("Request to save AdditionalData : {}", additionalData);
        return additionalDataRepository.save(additionalData);
    }

    @Override
    public Optional<AdditionalData> partialUpdate(AdditionalData additionalData) {
        log.debug("Request to partially update AdditionalData : {}", additionalData);

        return additionalDataRepository
            .findById(additionalData.getId())
            .map(existingAdditionalData -> {
                if (additionalData.getFieldCode() != null) {
                    existingAdditionalData.setFieldCode(additionalData.getFieldCode());
                }
                if (additionalData.getValue() != null) {
                    existingAdditionalData.setValue(additionalData.getValue());
                }

                return existingAdditionalData;
            })
            .map(additionalDataRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdditionalData> findAll(Pageable pageable) {
        log.debug("Request to get all AdditionalData");
        return additionalDataRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AdditionalData> findOne(Long id) {
        log.debug("Request to get AdditionalData : {}", id);
        return additionalDataRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete AdditionalData : {}", id);
        additionalDataRepository.deleteById(id);
    }
}
