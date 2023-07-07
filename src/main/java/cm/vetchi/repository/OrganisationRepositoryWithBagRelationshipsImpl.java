package cm.vetchi.repository;

import cm.vetchi.domain.Organisation;
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
public class OrganisationRepositoryWithBagRelationshipsImpl implements OrganisationRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Organisation> fetchBagRelationships(Optional<Organisation> organisation) {
        return organisation.map(this::fetchServices).map(this::fetchInterfaces);
    }

    @Override
    public Page<Organisation> fetchBagRelationships(Page<Organisation> organisations) {
        return new PageImpl<>(
            fetchBagRelationships(organisations.getContent()),
            organisations.getPageable(),
            organisations.getTotalElements()
        );
    }

    @Override
    public List<Organisation> fetchBagRelationships(List<Organisation> organisations) {
        return Optional.of(organisations).map(this::fetchServices).map(this::fetchInterfaces).orElse(Collections.emptyList());
    }

    Organisation fetchServices(Organisation result) {
        return entityManager
            .createQuery(
                "select organisation from Organisation organisation left join fetch organisation.services where organisation is :organisation",
                Organisation.class
            )
            .setParameter("organisation", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Organisation> fetchServices(List<Organisation> organisations) {
        return entityManager
            .createQuery(
                "select distinct organisation from Organisation organisation left join fetch organisation.services where organisation in :organisations",
                Organisation.class
            )
            .setParameter("organisations", organisations)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }

    Organisation fetchInterfaces(Organisation result) {
        return entityManager
            .createQuery(
                "select organisation from Organisation organisation left join fetch organisation.interfaces where organisation is :organisation",
                Organisation.class
            )
            .setParameter("organisation", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Organisation> fetchInterfaces(List<Organisation> organisations) {
        return entityManager
            .createQuery(
                "select distinct organisation from Organisation organisation left join fetch organisation.interfaces where organisation in :organisations",
                Organisation.class
            )
            .setParameter("organisations", organisations)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
