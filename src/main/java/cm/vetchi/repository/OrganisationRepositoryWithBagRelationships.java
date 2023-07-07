package cm.vetchi.repository;

import cm.vetchi.domain.Organisation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface OrganisationRepositoryWithBagRelationships {
    Optional<Organisation> fetchBagRelationships(Optional<Organisation> organisation);

    List<Organisation> fetchBagRelationships(List<Organisation> organisations);

    Page<Organisation> fetchBagRelationships(Page<Organisation> organisations);
}
