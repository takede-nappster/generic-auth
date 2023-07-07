package cm.vetchi.repository;

import cm.vetchi.domain.OrganisationService;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface OrganisationServiceRepositoryWithBagRelationships {
    Optional<OrganisationService> fetchBagRelationships(Optional<OrganisationService> organisationService);

    List<OrganisationService> fetchBagRelationships(List<OrganisationService> organisationServices);

    Page<OrganisationService> fetchBagRelationships(Page<OrganisationService> organisationServices);
}
