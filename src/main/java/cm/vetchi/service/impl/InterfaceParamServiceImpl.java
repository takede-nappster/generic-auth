package cm.vetchi.service.impl;

import cm.vetchi.domain.InterfaceParam;
import cm.vetchi.repository.InterfaceParamRepository;
import cm.vetchi.service.InterfaceParamService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link InterfaceParam}.
 */
@Service
@Transactional
public class InterfaceParamServiceImpl implements InterfaceParamService {

    private final Logger log = LoggerFactory.getLogger(InterfaceParamServiceImpl.class);

    private final InterfaceParamRepository interfaceParamRepository;

    public InterfaceParamServiceImpl(InterfaceParamRepository interfaceParamRepository) {
        this.interfaceParamRepository = interfaceParamRepository;
    }

    @Override
    public InterfaceParam save(InterfaceParam interfaceParam) {
        log.debug("Request to save InterfaceParam : {}", interfaceParam);
        return interfaceParamRepository.save(interfaceParam);
    }

    @Override
    public InterfaceParam update(InterfaceParam interfaceParam) {
        log.debug("Request to save InterfaceParam : {}", interfaceParam);
        return interfaceParamRepository.save(interfaceParam);
    }

    @Override
    public Optional<InterfaceParam> partialUpdate(InterfaceParam interfaceParam) {
        log.debug("Request to partially update InterfaceParam : {}", interfaceParam);

        return interfaceParamRepository
            .findById(interfaceParam.getId())
            .map(existingInterfaceParam -> {
                if (interfaceParam.getName() != null) {
                    existingInterfaceParam.setName(interfaceParam.getName());
                }
                if (interfaceParam.getValue() != null) {
                    existingInterfaceParam.setValue(interfaceParam.getValue());
                }

                return existingInterfaceParam;
            })
            .map(interfaceParamRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InterfaceParam> findAll(Pageable pageable) {
        log.debug("Request to get all InterfaceParams");
        return interfaceParamRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<InterfaceParam> findOne(Long id) {
        log.debug("Request to get InterfaceParam : {}", id);
        return interfaceParamRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete InterfaceParam : {}", id);
        interfaceParamRepository.deleteById(id);
    }
}
