package cm.vetchi.repository;

import cm.vetchi.domain.OrganisationService;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OrganisationService entity.
 */
@Repository
public interface OrganisationServiceRepository
    extends OrganisationServiceRepositoryWithBagRelationships, JpaRepository<OrganisationService, Long> {
    default Optional<OrganisationService> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<OrganisationService> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<OrganisationService> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
