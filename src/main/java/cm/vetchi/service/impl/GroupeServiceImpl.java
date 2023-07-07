package cm.vetchi.service.impl;

import cm.vetchi.domain.Groupe;
import cm.vetchi.repository.GroupeRepository;
import cm.vetchi.service.GroupeService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Groupe}.
 */
@Service
@Transactional
public class GroupeServiceImpl implements GroupeService {

    private final Logger log = LoggerFactory.getLogger(GroupeServiceImpl.class);

    private final GroupeRepository groupeRepository;

    public GroupeServiceImpl(GroupeRepository groupeRepository) {
        this.groupeRepository = groupeRepository;
    }

    @Override
    public Groupe save(Groupe groupe) {
        log.debug("Request to save Groupe : {}", groupe);
        return groupeRepository.save(groupe);
    }

    @Override
    public Groupe update(Groupe groupe) {
        log.debug("Request to save Groupe : {}", groupe);
        return groupeRepository.save(groupe);
    }

    @Override
    public Optional<Groupe> partialUpdate(Groupe groupe) {
        log.debug("Request to partially update Groupe : {}", groupe);

        return groupeRepository
            .findById(groupe.getId())
            .map(existingGroupe -> {
                if (groupe.getName() != null) {
                    existingGroupe.setName(groupe.getName());
                }
                if (groupe.getDescrtion() != null) {
                    existingGroupe.setDescrtion(groupe.getDescrtion());
                }

                return existingGroupe;
            })
            .map(groupeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Groupe> findAll(Pageable pageable) {
        log.debug("Request to get all Groupes");
        return groupeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Groupe> findOne(Long id) {
        log.debug("Request to get Groupe : {}", id);
        return groupeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Groupe : {}", id);
        groupeRepository.deleteById(id);
    }
}
