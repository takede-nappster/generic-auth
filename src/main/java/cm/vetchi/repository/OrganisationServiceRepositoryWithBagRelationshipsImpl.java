package cm.vetchi.repository;

import cm.vetchi.domain.OrganisationService;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class OrganisationServiceRepositoryWithBagRelationshipsImpl implements OrganisationServiceRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<OrganisationService> fetchBagRelationships(Optional<OrganisationService> organisationService) {
        return organisationService.map(this::fetchMembers).map(this::fetchGroups);
    }

    @Override
    public Page<OrganisationService> fetchBagRelationships(Page<OrganisationService> organisationServices) {
        return new PageImpl<>(
            fetchBagRelationships(organisationServices.getContent()),
            organisationServices.getPageable(),
            organisationServices.getTotalElements()
        );
    }

    @Override
    public List<OrganisationService> fetchBagRelationships(List<OrganisationService> organisationServices) {
        return Optional.of(organisationServices).map(this::fetchMembers).map(this::fetchGroups).orElse(Collections.emptyList());
    }

    OrganisationService fetchMembers(OrganisationService result) {
        return entityManager
            .createQuery(
                "select organisationService from OrganisationService organisationService left join fetch organisationService.members where organisationService is :organisationService",
                OrganisationService.class
            )
            .setParameter("organisationService", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<OrganisationService> fetchMembers(List<OrganisationService> organisationServices) {
        return entityManager
            .createQuery(
                "select distinct organisationService from OrganisationService organisationService left join fetch organisationService.members where organisationService in :organisationServices",
                OrganisationService.class
            )
            .setParameter("organisationServices", organisationServices)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }

    OrganisationService fetchGroups(OrganisationService result) {
        return entityManager
            .createQuery(
                "select organisationService from OrganisationService organisationService left join fetch organisationService.groups where organisationService is :organisationService",
                OrganisationService.class
            )
            .setParameter("organisationService", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<OrganisationService> fetchGroups(List<OrganisationService> organisationServices) {
        return entityManager
            .createQuery(
                "select distinct organisationService from OrganisationService organisationService left join fetch organisationService.groups where organisationService in :organisationServices",
                OrganisationService.class
            )
            .setParameter("organisationServices", organisationServices)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
