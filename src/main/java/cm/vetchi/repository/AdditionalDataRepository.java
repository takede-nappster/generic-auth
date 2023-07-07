package cm.vetchi.repository;

import cm.vetchi.domain.AdditionalData;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AdditionalData entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdditionalDataRepository extends JpaRepository<AdditionalData, Long> {}
